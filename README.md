# stable-diffusion-ts

Work In Progress

- Very much a hobby personal use concept, will improve over time but no support should be expected
- Only used on Windows so far, more work may be required to improve cross-platform compatibility.

## Preinstall

Read the docs for the following:
- https://github.com/CompVis/stable-diffusion
- https://github.com/basujindal/stable-diffusion
- https://github.com/JingyunLiang/SwinIR

## Install

### Conda

1. Install Conda locally https://docs.conda.io/en/latest/
2. Run `conda env create -f environment.yaml`
3. You may need to add the `conda` executable to your `PATH`.

### Docker

Ensure Docker is installed locally for upscaling container.

### Vendors

1. Clone and copy https://github.com/basujindal/stable-diffusion to vendors folder
2. Download latest `stable-diffusion` model from https://huggingface.co/CompVis/stable-diffusion-v-1-4-original
3. Copy model to `vendors/stable-diffusion/models/ldm/stable-diffusion-v1/model.ckpt`

```shell
pnpm install
```

## Usage

Add content to profiles.ts and understand the cli interface via schema types.

```shell
pnpm txt2img --project=yoji --count=10

pnpm img2img --project=yoji --mode=narrow --strength=0.35 --source=foo.jpg

pnpm upscale --project=yoji # Will read all files in project upscale directory.
```