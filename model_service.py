import base64
import hashlib
import io
import json
import os
import threading
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

MODEL_REPOSITORY = "jonasherminio/resnet152v2-skin-cancer-ham10000"
MODEL_REVISION = "ac19ea652bea9968867a41bdede77a45130eec0b"
MODEL_SHA256 = "2ba94c251d36828ff42a41924e0fdeb3602746a58472a738199323dace5d6d70"
MODEL_URL = (
    "https://huggingface.co/"
    f"{MODEL_REPOSITORY}/resolve/{MODEL_REVISION}/tcc.h5?download=true"
)
MODEL_PATH = Path(__file__).parent / "models" / "ham10000" / "tcc.h5"
MAX_IMAGE_BYTES = 12 * 1024 * 1024

CLASSES = [
    {
        "code": "akiec",
        "name": "Actinic keratoses / Bowen disease",
        "formal_name": "Actinic keratosis / squamous cell carcinoma in situ",
        "category": "Neoplastic / Pre-malignant",
        "severity": "Moderate",
    },
    {
        "code": "bcc",
        "name": "Basal cell carcinoma",
        "formal_name": "Basal cell carcinoma",
        "category": "Neoplastic / Pre-malignant",
        "severity": "Urgent",
    },
    {
        "code": "df",
        "name": "Dermatofibroma",
        "formal_name": "Dermatofibroma",
        "category": "Benign Lesion",
        "severity": "Moderate",
    },
    {
        "code": "bkl",
        "name": "Benign keratosis-like lesion",
        "formal_name": "Benign keratosis-like lesion",
        "category": "Benign Lesion",
        "severity": "Moderate",
    },
    {
        "code": "mel",
        "name": "Melanoma",
        "formal_name": "Melanoma",
        "category": "Neoplastic / Pre-malignant",
        "severity": "Urgent",
    },
    {
        "code": "nv",
        "name": "Melanocytic nevus",
        "formal_name": "Melanocytic nevus",
        "category": "Benign Lesion",
        "severity": "Moderate",
    },
    {
        "code": "vasc",
        "name": "Vascular lesion",
        "formal_name": "Vascular lesion",
        "category": "Benign Lesion",
        "severity": "Moderate",
    },
]

state = {"ready": False, "status": "starting", "error": None, "model": None}
state_lock = threading.Lock()
prediction_lock = threading.Lock()


def update_state(**changes):
    with state_lock:
        state.update(changes)


def sha256_file(file_path):
    digest = hashlib.sha256()
    with file_path.open("rb") as model_file:
        while chunk := model_file.read(1024 * 1024):
            digest.update(chunk)
    return digest.hexdigest()


def download_model():
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    if MODEL_PATH.exists():
        if sha256_file(MODEL_PATH) == MODEL_SHA256:
            return
        MODEL_PATH.unlink()

    temporary_path = MODEL_PATH.with_suffix(".h5.download")
    request = urllib.request.Request(
        MODEL_URL,
        headers={"User-Agent": "DermaVision-local-research-prototype/1.0"},
    )
    digest = hashlib.sha256()
    size = 0
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            with temporary_path.open("wb") as output:
                while chunk := response.read(1024 * 1024):
                    size += len(chunk)
                    if size > 300 * 1024 * 1024:
                        raise ValueError("Model file exceeded the expected download size.")
                    digest.update(chunk)
                    output.write(chunk)
        if digest.hexdigest() != MODEL_SHA256:
            raise ValueError("Downloaded model failed its SHA-256 integrity check.")
        temporary_path.replace(MODEL_PATH)
    except Exception:
        temporary_path.unlink(missing_ok=True)
        raise


def load_model():
    update_state(status="starting", error=None)
    try:
        os.environ["TF_USE_LEGACY_KERAS"] = "1"
        import tensorflow as tf

        tf.config.threading.set_intra_op_parallelism_threads(2)
        tf.config.threading.set_inter_op_parallelism_threads(1)
        update_state(status="downloading")
        download_model()
        update_state(status="loading")
        model = tf.keras.models.load_model(
            MODEL_PATH,
            compile=False,
        )
        if model.output_shape[-1] != len(CLASSES):
            raise ValueError("Model output does not match the seven-class label map.")
        update_state(ready=True, status="ready", model=model)
        print("Local HAM10000 research model is ready.", flush=True)
    except Exception as error:
        update_state(status="error", error=f"{type(error).__name__}: {error}")
        print(f"Could not initialize local HAM10000 model: {error}", flush=True)


def analysis_result(scores):
    top_indices = sorted(range(len(scores)), key=lambda index: scores[index], reverse=True)[:3]
    top_class = CLASSES[top_indices[0]]
    top_score = round(float(scores[top_indices[0]]) * 100, 1)
    alternatives = [
        {
            "name": f"{CLASSES[index]['name']} (HAM10000 class)",
            "confidence": round(float(scores[index]) * 100, 1),
            "distinguishingFeature": "Alternative model output score only; not an independently confirmed diagnosis.",
        }
        for index in top_indices[1:]
    ]
    urgency = (
        "The experimental model ranked a class associated with malignancy. This is not a diagnosis; arrange prompt assessment by a qualified clinician."
        if top_class["code"] in {"akiec", "bcc", "mel"}
        else "This experimental model output cannot rule out cancer or determine clinical urgency. Seek professional assessment for a new, changing, bleeding, or concerning lesion."
    )
    disclaimer = (
        "RESEARCH PROTOTYPE ONLY — This unvalidated HAM10000 classifier reports a model score, not a calibrated probability or diagnosis. "
        "It was developed for dermatoscopic pigmented-lesion categories and may be wrong, biased, or unsuitable for ordinary phone photographs. "
        "It cannot determine whether an image contains a lesion and must not be used to diagnose, rule out cancer, or guide treatment. "
        "The model card claims ResNet152V2, but the checkpoint configuration contains Xception-style layers; its architecture and training claims are unverified. "
        "Seek a qualified clinician for medical concerns. Checkpoint licensing is ambiguous; non-commercial research use only."
    )
    return {
        "analysisSource": "local-ham10000-research",
        "modelNotes": disclaimer,
        "primaryDiagnosis": {
            "name": f"{top_class['name']} (HAM10000 model class)",
            "scientificName": f"HAM10000 label: {top_class['code']}",
            "category": top_class["category"],
            "confidence": top_score,
            "severity": top_class["severity"],
            "summary": (
                f"The experimental classifier's highest output was {top_class['name']} "
                f"({top_score}% uncalibrated model score). This output is not a diagnosis "
                "and has not been clinically validated."
            ),
        },
        "visualAssessment": {
            "morphology": "Not assessed; this classifier returns class scores only.",
            "color": "Not assessed.",
            "distribution": "Not assessed.",
            "texture": "Not assessed.",
        },
        "abcdeMelanomaCheck": {
            "applicable": False,
            "asymmetry": {"status": "Not Applicable", "details": "The model does not evaluate ABCDE criteria."},
            "border": {"status": "Not Applicable", "details": "The model does not evaluate ABCDE criteria."},
            "color": {"status": "Not Applicable", "details": "The model does not evaluate ABCDE criteria."},
            "diameter": {"status": "Indeterminate", "details": "Image scale and lesion diameter are not measured."},
            "evolving": {"status": "Indeterminate", "details": "Change over time cannot be determined from one image."},
            "overallRisk": "Moderate",
        },
        "differentialDiagnoses": alternatives,
        "clinicalDetails": {
            "overview": "This is an experimental image-classification output, not a clinical assessment.",
            "hallmarkSymptoms": ["Symptoms are not assessed by this image classifier."],
            "rootCauses": ["Causes are not assessed by this image classifier."],
            "triggers": ["Triggers are not assessed by this image classifier."],
            "preventiveMeasures": ["The result cannot determine a prevention or treatment plan."],
            "homeCareAndNonRx": ["Do not use this output to select treatment or delay clinical care."],
            "whenToSeeDoctor": [
                urgency,
                "Seek prompt professional assessment for a new, changing, bleeding, painful, or otherwise concerning lesion.",
            ],
            "recommendedSpecialist": "Qualified healthcare professional or dermatologist",
            "potentialClinicalTreatments": ["Treatment decisions require clinician evaluation."],
        },
        "questionsForDoctor": [
            "What examination or tests are appropriate for this lesion?",
            "Does this lesion need dermoscopy or biopsy?",
        ],
        "disclaimer": disclaimer,
    }


class ModelRequestHandler(BaseHTTPRequestHandler):
    def log_message(self, format_string, *args):
        print(f"[local-model] {format_string % args}", flush=True)

    def send_json(self, status_code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path != "/health":
            self.send_json(404, {"error": "Not found."})
            return
        with state_lock:
            status = {key: value for key, value in state.items() if key != "model"}
        self.send_json(200, status)

    def do_POST(self):
        if self.path != "/predict":
            self.send_json(404, {"error": "Not found."})
            return
        with state_lock:
            ready = state["ready"]
            model = state["model"]
            model_error = state["error"]
            model_status = state["status"]
        if not ready:
            detail = f" Local model startup failed: {model_error}" if model_error else ""
            self.send_json(
                503,
                {
                    "error": f"Local model is {model_status}.{detail}",
                    "setupInstructions": "Install requirements-local.txt and restart the app if startup failed.",
                },
            )
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            if content_length <= 0 or content_length > 17 * 1024 * 1024:
                self.send_json(413, {"error": "Image request must be under 12 MB."})
                return
            request_body = json.loads(self.rfile.read(content_length))
            image_data = request_body.get("image")
            if not isinstance(image_data, str):
                self.send_json(400, {"error": "Valid base64 image data is required."})
                return
            image_bytes = base64.b64decode(image_data, validate=True)
            if len(image_bytes) > MAX_IMAGE_BYTES:
                self.send_json(413, {"error": "Image must be under 12 MB."})
                return

            from PIL import Image
            import numpy as np

            Image.MAX_IMAGE_PIXELS = 20_000_000
            with Image.open(io.BytesIO(image_bytes)) as image:
                image = image.convert("RGB").resize((150, 150))
                input_array = np.asarray(image, dtype=np.float32) / 255.0
            with prediction_lock:
                scores = np.asarray(model.predict(np.expand_dims(input_array, axis=0), verbose=0))[0]
            if (
                scores.shape != (len(CLASSES),)
                or not np.isfinite(scores).all()
                or np.any(scores < 0)
                or np.any(scores > 1)
                or not np.isclose(np.sum(scores), 1.0, atol=0.05)
            ):
                raise RuntimeError("Model returned invalid output scores.")
            self.send_json(200, analysis_result(scores))
        except (ValueError, json.JSONDecodeError) as error:
            self.send_json(400, {"error": f"Image could not be processed: {error}"})
        except Exception as error:
            print(f"Local image prediction failed: {error}", flush=True)
            self.send_json(500, {"error": "The local model could not process this image."})


if __name__ == "__main__":
    threading.Thread(target=load_model, daemon=True).start()
    port = int(os.environ.get("LOCAL_MODEL_PORT", "8765"))
    ThreadingHTTPServer(("127.0.0.1", port), ModelRequestHandler).serve_forever()
