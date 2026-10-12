<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# DermaVision

DermaVision's local classifier is an experimental, non-clinical research prototype for seven HAM10000 dermatoscopic image classes. It does not provide a diagnosis, detect whether an image contains skin, or replace care from a qualified clinician.

## Run the local research model

Requirements: Node.js and Python 3.13 on Windows (or Python 3 on macOS/Linux), with enough disk space for TensorFlow and the model checkpoint.

1. Install JavaScript dependencies with `npm install`.
2. Create an isolated Python environment and install the local model dependencies:

   **Windows**
   ```powershell
   py -3.13 -m venv .venv-localmodel
   .\.venv-localmodel\Scripts\python -m pip install -r requirements-local.txt
   ```

   **macOS/Linux**
   ```sh
   python3 -m venv .venv-localmodel
   .venv-localmodel/bin/python -m pip install -r requirements-local.txt
   ```

3. Run `npm run dev`. The app starts a loopback-only Python inference service and downloads the pinned 210 MiB checkpoint on first startup. The file is SHA-256 verified and stored under `models/ham10000/`; it is not committed to source control. First startup can take several minutes while the model downloads and loads on CPU.
4. Open the URL printed in the terminal. `/api/health` reports whether the local classifier is ready.

The server automatically uses `.venv-localmodel` when present. Otherwise it tries `py -3.13` on Windows or `python3` on macOS/Linux. To use another Python executable, set `LOCAL_MODEL_PYTHON` to its executable path before starting the app.

On Windows, if TensorFlow installation fails with a Windows long-path error, create the virtual environment in a short path outside the project and set `LOCAL_MODEL_PYTHON` in the ignored `.env.local` file to that environment's `Scripts/python.exe`.

## Supported model labels

The checkpoint maps outputs in this exact order: `akiec` (actinic keratoses/Bowen disease), `bcc` (basal cell carcinoma), `df` (dermatofibroma), `bkl` (benign keratosis-like lesion), `mel` (melanoma), `nv` (melanocytic nevus), and `vasc` (vascular lesion). Image preprocessing follows the published companion inference code: RGB, resize to 150×150, and divide pixel values by 255.

The result score is an uncalibrated model output, not a probability of disease. The model does not analyze symptoms, describe visual morphology, verify that the input shows skin, or assess ABCDE criteria. It is intended only for dermatoscopic images in these seven categories; ordinary phone photographs, inflammatory conditions, and other skin disorders are outside its demonstrated scope. Do not use it to diagnose, rule out cancer, or choose treatment. Seek professional evaluation for any concerning lesion.

## Checkpoint provenance and usage restriction

The prototype downloads `tcc.h5` from [jonasherminio/resnet152v2-skin-cancer-ham10000](https://huggingface.co/jonasherminio/resnet152v2-skin-cancer-ham10000), pinned to a repository revision and checked against SHA-256 `2ba94c251d36828ff42a41924e0fdeb3602746a58472a738199323dace5d6d70`. **The checkpoint architecture is inconsistent with its model card:** inspection of the HDF5 configuration shows Xception-style `SeparableConv2D` layers, while the card claims ResNet152V2. This mismatch has not been resolved with the author, so architecture, provenance, and training claims are unverified. The checkpoint's Hugging Face metadata declares MIT, while the companion project describes the work as strictly academic/scientific/portfolio use. Because those terms conflict, this integration is marked **non-commercial research prototype only** pending clarification from the author. The model card reports accuracy that this project has not independently reproduced or validated.

## Other dataset references

- [ISIC Archive](https://www.isic-archive.com/): dermoscopic image datasets and research resources.
- [HAM10000](https://doi.org/10.1038/sdata.2018.161): 10,015 dermatoscopic images across seven pigmented-lesion categories. This is the only dataset represented by the current local checkpoint.
- [DermNet](https://dermnetnz.org/): broad educational reference material; it is not integrated into this classifier.

The project does not bundle or train on the ISIC Archive or DermNet. A classifier for their wider disease coverage requires separately licensed training data, an appropriate model, and independent evaluation.
