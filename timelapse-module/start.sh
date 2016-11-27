#!/bin/sh
# Start the service Snapshot
DIR=./
SCRIPT=snapshot.sh
start() {
         echo Starting Script:$SCRIPT 
         $DIR$SCRIPT > /dev/null 2>&1 &
}
# Stop the service Screenshot
stop() {
        echo stopping  $DIR$SCRIPT
        killall $SCRIPT

}
### main logic ###
case "$1" in
  start)
        start
        ;;
  stop)
        stop
        ;;
  restart)
        stop
        start
        ;;
  *)
        echo $"Usage: $0 {start|stop|restart}"
        exit 1
esac
exit 0