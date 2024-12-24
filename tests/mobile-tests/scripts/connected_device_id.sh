#!/bin/bash
export REAL_DEVICE=$(adb devices | grep -v emulator | sed -n 2p |  awk '{ print $1}')