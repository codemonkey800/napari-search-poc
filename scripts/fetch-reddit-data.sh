#!/bin/bash

DIR="$(dirname $0)"

curl -o reddit.json.bz2 http://files.pushshift.io/reddit/comments/RC_2006-02.bz2
bzip2 -d reddit.json.bz2
