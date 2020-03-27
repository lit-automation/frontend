package main

import (
	"fmt"
	"net/http"
	"strings"

	log "github.com/sirupsen/logrus"
)

func main() {
	log.Info("Started frontend service")
	// Istio health check
	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(200)
		_, err := w.Write([]byte("ok"))
		if err != nil {
			log.Errorf("cant response properly: %s", err)
		}
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fileServer := http.FileServer(http.Dir("./dist"))
		path := r.URL.Path
		if !strings.HasPrefix(path, "/vendor") &&
			!strings.HasPrefix(path, "/assets") &&
			!strings.HasPrefix(path, "/bundle.js") {
			r.URL.Path = "/"
		}
		fileServer.ServeHTTP(w, r)
	})
	log.Info("Started listener")
	panic(fmt.Sprintf("server crashed: %s", http.ListenAndServe("0.0.0.0:9002", nil).Error()))
}
