/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
      app.receivedEvent('deviceready');
      if (window.cblite) {
        window.cblite.getURL(function (err, url) {
          if (err) {
            app.logMessage("error launching Couchbase Lite: " + err)
          } else {
            app.logMessage("Couchbase Lite running at " + url);

            var client = new SwaggerClient({
              spec: window.spec,
              usePromise: true,
            })
              .then(function (client) {
                client.setHost(url.split('/')[2]);
                client.server.get_all_dbs()
                  .then(function (res) {
                    var dbs = res.obj;
                    if (dbs.indexOf('todo') == -1) {
                      return client.database.put_db({db: 'todo'});
                    }
                    return client.database.get_db({db: 'todo'});
                  })
                  .then(function (res) {
                    return client.document.post({db: 'todo', body: {task: 'Groceries'}});
                  })
                  .then(function (res) {
                    return client.query.get_db_all_docs({db: 'todo'});
                  })
                  .then(function (res) {
                    alert(res.obj.rows.length + ' document(s) in the database');
                  })
                  .catch(function (err) {
                    console.log(err)
                  });
              });
            
          }
        });
      } else {
        app.logMessage("error, Couchbase Lite plugin not found.")
      }
    },
    logMessage: function(message) {
      var p = document.createElement("p");
      p.innerHTML = message;
      document.body.getElementsByClassName('app')[0].appendChild(p);
      console.log(message);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
