#!/bin/bash
truffle migrate --reset --network evoting 
for dir in client signer
do
    condir="../$dir/contracts"
    if [ -d $condir ]; then
        rm -r $condir
        cp -r ./build/contracts "../$dir"
    else 
        cp -r ./build/contracts "../$dir"
    fi
done