/*
 *  eHealth sensor platform for Arduino and Raspberry from Cooking-hacks.
 *
 *  Description: "The e-Health Sensor Shield allows Arduino and Raspberry Pi
 *  users to perform biometric and medical applications by using 9 different
 *  sensors: Pulse and Oxygen in Blood Sensor (SPO2), Airflow Sensor (Breathing),
 *  Body Temperature, Electrocardiogram Sensor (ECG), Glucometer, Galvanic Skin
 *  Response Sensor (GSR - Sweating), Blood Pressure (Sphygmomanometer) and
 *  Patient Position (Accelerometer)."
 *
 *  In this example we read the values in volts of EMG sensor and show
 *  these values in the serial monitor.
 *
 *  Copyright (C) 2012 Libelium Comunicaciones Distribuidas S.L.
 *  http://www.libelium.com
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *  Version 2.0
 *  Author: Luis Martin & Ahmad Saad & Anartz Nuin
 */

//Include eHealth library
#include "eHealth.h"
#include <mysql/mysql.h>
#include <string>
#include <sstream>

using namespace std;
int cont = 0;
string server = "localhost";
string user = "root";
string pw = "pi_sql";
string database = "health_data";
string BP_s,SP_s;
int bp,sp,pre_bp,pre_sp;

MYSQL *connection,mysql;
void readPulsioximeter();

void setup() {

	eHealth.initPulsioximeter();
	//Attach the inttruptions for using the pulsioximeter.
	attachInterrupt(6, readPulsioximeter, RISING);

}

void loop() {

  bp = eHealth.getBPM();
  sp = eHealth.getOxygenSaturation();
	if(bp - pre_bp > 20){
		bp = pre_bp;
	}
  stringstream s_bp;
  s_bp  << bp;
  stringstream s_sp;
  s_sp << sp;
  s_bp >> BP_s;
  s_sp >> SP_s;
  string response = "INSERT into health_data(PBbpm,SP02) VALUES('"+BP_s+"','"+SP_s+"')";
  mysql_query(connection,response.c_str());
  //delay(500);
  printf("PRbpm : %d",eHealth.getBPM());

  printf("    %%SPo2 : %d\n", eHealth.getOxygenSaturation());

  printf("=============================\n");
  delay(500);
  //delay(500);
	pre_bp = bp;
}

void readPulsioximeter(){

  cont ++;

  if (cont == 50) { //Get only of one 50 measures to reduce the latency
    eHealth.readPulsioximeter();
    cont = 0;
  }
}

int main (){
	setup();
	connection = mysql_init(NULL);
	if(!mysql_real_connect(connection,server.c_str(),user.c_str(),pw.c_str(),database.c_str(),0,NULL,0)){
		printf("could not setup server");
		printf("\n");
		exit(1);
	}else{
		printf("Was able to connect to database");
		printf("\n");
		//for(int i = 0;i < 10;i++){
		//	mysql_query(connection,"INSERT into health_data(PBbpm,SP02) VALUES( '20','10')");
		//}
	}
	while(1){
		loop();
	}
	return (0);
}
