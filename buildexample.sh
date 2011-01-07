#!/bin/sh

rm -f zipfile.zip
zip zipfile.zip $(git ls-files)
