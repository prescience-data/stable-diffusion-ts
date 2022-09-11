#!/usr/bin/env bash

set -e

# Clone StableDiffusion

declare CWD=../vendor/stable-diffusion

rm -rf $CWD || exit
git clone --depth=1 --branch=master https://github.com/basujindal/stable-diffusion.git $CWD
rm -rf $CWD/.git

# Download weights

# curl -o ../vendor/stable-diffusion/models/ldm/stable-diffusion-v1/model.ckpt <URL REQUIRES LOGIN>
