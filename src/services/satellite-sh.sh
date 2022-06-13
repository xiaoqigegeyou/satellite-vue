#!/bin/sh

satellite_service_pid=`ps -aux|grep -v 'grep'|grep -c '/satellite-service'`

ulimit -c unlimited
#echo "$satellite_service_pid"

if [ $satellite_service_pid -eq 0 ]
then
cd /opt/ks/web/screendisplay/tomcat7/webapps/
./satellite-service &
now=`date  +%Y-%m-%d[%H:%M:%S]`
echo "at $now start satellite-service -b /n" >> check_satellite-service.log
fi