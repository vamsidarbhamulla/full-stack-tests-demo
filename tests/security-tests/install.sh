#!/bin/bash

# Function to install ZAP Proxy on macOS
install_zap_mac() {
  echo "Detected macOS. Downloading and installing ZAP Proxy..."
  brew install zaproxy
}

# Function to install ZAP Proxy on Linux
install_zap_linux() {
  echo "Detected Linux. Downloading and installing ZAP Proxy..."
  wget -O ZAP_2_11_1_Linux.tar.gz https://github.com/zaproxy/zaproxy/releases/download/v2.11.1/ZAP_2_11_1_Linux.tar.gz
  tar -xzf ZAP_2_11_1_Linux.tar.gz
  sudo mv ZAP_2_11_1 /opt/ZAP
  sudo ln -s /opt/ZAP/zap.sh /usr/local/bin/zap
  echo "Installation complete. You can run ZAP Proxy using the 'zap' command."
}

# Function to install ZAP Proxy on Windows using WSL
install_zap_wsl() {
  echo "Detected Windows Subsystem for Linux (WSL). Downloading and installing ZAP Proxy..."
  wget -O ZAP_2_11_1_Linux.tar.gz https://github.com/zaproxy/zaproxy/releases/download/v2.11.1/ZAP_2_11_1_Linux.tar.gz
  tar -xzf ZAP_2_11_1_Linux.tar.gz
  sudo mv ZAP_2_11_1 /opt/ZAP
  sudo ln -s /opt/ZAP/zap.sh /usr/local/bin/zap
  echo "Installation complete. You can run ZAP Proxy using the 'zap' command."
}

# Detect the operating system
case "$OSTYPE" in
  darwin*)  install_zap_mac ;;
  linux*)
    if grep -q Microsoft /proc/version; then
      install_zap_wsl
    else
      install_zap_linux
    fi
    ;;
  *) echo "Unsupported operating system: $OSTYPE" ;;
esac
