#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "DDSWMN";
const char* password = "9821__Dgk***";

// Set your desired username and password for basic authentication
const char* http_username = "Arman_is_koskhol";
const char* http_password = "h38h&HS27h*&gd";

ESP8266WebServer server(80);
HTTPClient http;
WiFiClient client;
String url = "http://37.27.2.198:7777/get_room_lamp?username=aisjdiujwuija&password=JMFUNsjs2is1s2HJSMXHD&id=";

void handleRoot() {
  if (!server.authenticate(http_username, http_password)) {
    return server.requestAuthentication();
  }
  String message = "Hello, you are authorized!";
  server.send(200, "text/plain", message);
}

void handleTurnOnLampRoute() {
//  if (!server.authenticate(http_username, http_password)) {
//    return server.requestAuthentication();
//  }
  
  digitalWrite(D1, HIGH);

  // Get the IP address of the NodeMCU
  IPAddress localIP = WiFi.localIP();
  String message = "D5 Pin is ON for 5 seconds and then turned OFF.\n";
  message += "IP Address: " + localIP.toString();
  delay(50);
  // Send response back to the client
  server.send(200, "text/plain", message);
}


void handleTurnOffLampRoute() {
//  if (!server.authenticate(http_username, http_password)) {
//    return server.requestAuthentication();
//  }
  
  digitalWrite(D1, LOW);

  // Get the IP address of the NodeMCU
  IPAddress localIP = WiFi.localIP();
  String message = "D5 Pin is ON for 5 seconds and then turned OFF.\n";
  message += "IP Address: " + localIP.toString();
  delay(50);
  // Send response back to the client
  server.send(200, "text/plain", message);
}

void setup() {
  Serial.begin(115200);
  delay(10);

  pinMode(D1, OUTPUT);    // sets the digital pin 13 as output
  
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected!");

  // Start the server
  server.on("/", handleRoot);
  server.on("/TurnOnLamp", handleTurnOnLampRoute);
  server.on("/TurnOffLamp", handleTurnOffLampRoute);

 
  
  


//  // Set up SSL certificate
//  // You need to provide the certificate files (cert.pem) and (privatekey.pem)
//  server.setRSACert(new BearSSL::X509List(cert), new BearSSL::PrivateKey(privatekey));

  server.begin();
  Serial.println("Server started");
}

void loop() {

//  server.handleClient();
 
  Serial.println(url+String(WiFi.macAddress()));
  http.begin(client, url+String(WiFi.macAddress()));
  int httpCode = http.GET();
  Serial.println(httpCode);
  if (httpCode == 200) {
    Serial.printf("HTTP GET response code: %d\n", httpCode);
    String payload = http.getString();
    Serial.println("Response data:");
    Serial.println(payload);
    if(payload=="true"){
      handleTurnOnLampRoute();
      }
    else{
        handleTurnOffLampRoute();
      }
    // Process the data here
  } else {
    Serial.printf("HTTP GET request failed with error: %s\n", http.errorToString(httpCode).c_str());
  }
  
  http.end();
  delay(1000);
  
}
