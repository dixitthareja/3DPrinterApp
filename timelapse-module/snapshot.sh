#!/bin/sh
mkdir -p public/snapshot
folder=./screenshots/
sleeptime=5
while :
do 
timestamp="$(date +%s)"
echo cp $folder"$timestamp".jpg public/snapshot/snapshot.jpg
uvccapture -v -m -d/dev/video0 -o$folder"$timestamp".jpg 
cp $folder"$timestamp".jpg public/snapshot/snapshot.jpg
sleep $sleeptime
done
