#!/bin/bash

script="${HOME}/demo/semantic_segmentation.py"
# model="${HOME}/demo/deeplabv3_mnv2_pascal_quant_edgetpu.tflite"
# input="${HOME}/demo/owl.jpg"
# output="${HOME}/demo/segmentation_result.jpg"

model=$1
input=$2
output=$3

echo "start segmentation"

pwd

echo ${model}
echo ${input}
echo ${output}

# python3 ${script} \
#   --model ${model} \
#   --input ${input} \
#   --keep_aspect_ratio \
#   --output ${output}

