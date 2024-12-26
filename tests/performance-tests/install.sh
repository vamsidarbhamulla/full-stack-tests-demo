#!/usr/bin/env sh
brew --version || /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
node --version || brew install node
npm --version || brew install npm
go version || brew install go
echo "export PATH=$PATH:$(go env GOPATH)/bin" >> ~/.zprofile
echo "export PATH=$PATH:$(go env GOPATH)/bin" >> ~/.bash_profile
k6 version || brew install k6
which xk6 || GO_ENABLED=1 go install -trimpath go.k6.io/xk6/cmd/xk6@latest
# setting pyenv to handle multiple python versions without getting impact on macos internals python version
pyenv version || brew install pyenv
echo "export PATH=$(pyenv root)/shims:$PATH" >> ~/.zshrc
echo "export PATH=$(pyenv root)/shims:$PATH" >> ~/.bash_profile
(pyenv versions | grep 3.11)  && pyenv install 3.11 
pyenv global 3.11
python3 --version && pip3 --version && pip3 install --upgrade pip;

