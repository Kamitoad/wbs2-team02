# Readme: Komponenten-Struktur

## Allgemein

Auf oberster Ebene befinden sich neben den wichtigen Markdown-Dateien und der .gitignore die Verzeichnisse "server"
und "client", um Frontend und Backend sauber trennen zu können. Die Datenbank ist dabei auch im Verzeichnis
"server/database".


## Frontend: Angular

Für das Angular-Frontend wurde eine Komponenten-Struktur gewählt, welche alle Bestandteile in den drei Ordnern "shared",
"pages" und "assets" enthält.

In Komponenten ist lediglich eine Darstellungslogik für Daten enthalten, welche über Services bezogen werden.

Services enthalten für die Komponenten relevante Kernlogik (Funktionen und Variablen, bzw. BehaviorSubjects und
Observables) und sind für die Kommunikation mit dem Server über HTTP-Anfragen und WebSockets verantwortlich.

### Unterteilung in "shared", "pages" und "assets"

#### shared
Im Verzeichnis "shared" sind alle Ressourcen hinterlegt, welche beide Nutzergruppen dieser Anwendung benötigen, sowohl
der Admin als auch der User.
Angular-Elemente werden dabei in folgende Verzeichnisse unterteilt:

> - components
> - guards
> - models
> - pipes
> - services

Selbsterklärend befindet sich dann ein gemeinsam genutzter Angular-Service im Verzeichnis "services", usw.

> ##### Beispiel: <br>
> Der Authentifizierungsservice "auth" ist im Verzeichnis "shared/auth" hinterlegt, da sowohl der User als auch der Admin
sich zur Nutzung der Anwendung einloggen / registrieren müssen.

#### pages
Im Verzeichnis "pages" erfolgt direkt eine Unterteilung in die Verzeichnisse "admin" und "user". In diesen jeweiligen
Verzeichnissen sind nur die Elemente gespeichert, welche entweder nur vom Admin oder User verwendet werden. <br>
Die Angular-Elemente werden danach in eine Struktur wie im Verzeichnis "shared" unterteilt.

Einige Angular-Komponenten können weitere Unterkomponenten beinhalten, die für einen Teilbereich der ihnen
übergeordneten Hauptkomponente zuständig ist. Dies dient der einfachen Kapselung und Wartbarkeit des Codes.

> ##### Beispiel: <br>
> Um einen Darstellungsfehler in einer User-Card im Admin-Panel zu beheben, erfolgt zuerst die Navigation über
> "pages" in den "admin"-Bereich. Von dort aus ist in components unter der Komponente "userdata" eine weitere Komponente
> "userdata-card" zu finden.

#### assets

Im assets-Ordner werden neben allen benötigten Grafiken die Profilbilder der Nutzer gespeichert.

## Backend: NestJS

Für das NestJS-Backend wurde eine Komponenten-Struktur ähnlich wie im Angular-Frontend gewählt. 
Hierbei sind alle Bestandteile in den drei Ordnern "common", "modules" und "database" enthalten.

Controller sind lediglich dafür zuständig HTTP-Anfragen abzufangen, um diese an einen Service weiterzuleiten, welche die
Kernlogik enthalten. Bei Erfolg oder Fehler vom Service wird über den Controller ein Resultat oder Fehler an den Client
weitergeleitet.  

Gateways sind für die Behandlung von Sockets zuständig, haben eine ähnliche Funktion wie Controller, aber enthalten
etwas mehr Logik, um an entsprechende User relevante Daten zu senden.

Bei allen Anfragen wird überprüft, ob ein User authentifiziert ist, um Antworten auf diese zu erhalten.
Auf Admin-Anfragen wird mit einem eigenen "Roles" Decorator geprüft, ob ein Nutzer auch ein Admin ist.

### Aufteilung in "common", "modules" und "database"

#### database
Im Verzeichnis "database" werden über TypeORM-Entitäten die Datenbank modelliert. Auch ist ein weiteres Verzeichnis
"enums" in diesem enthalten, welches die Entitäten referenzieren.

#### common

Analog zum Frontend-Verzeichnis "shared" sind im Verzeichnis "common" die Ressourcen enthalten, welche Nutzer und Admin
benötigen.
NestJS-Elemente werden dabei in folgende Verzeichnisse unterteilt:

> - controllers
> - decorators
> - dtos
> - gateways
> - interceptors
> - services

Selbsterklärend befindet sich dann ein gemeinsam genutzter DTO im Verzeichnis "dto", usw.

> ##### Beispiel: <br>
> Bei erfolgreicher Anfrage vom Nutzer oder Admin wird ein OkDto versendet.
 
#### modules
Ähnlich wie im Frontend-Verzeichnis "pages" erfolgt auch in "modules" die Unterteilung in die Verzeichnisse "admin" und
"user". Entsprechend sind auch dort nur die Elemente enthalten, welche entweder nur der Nutzer oder nur der Admin
benötigt.

> ##### Beispiel: <br>
> Damit ein authentifizierter Nutzer der Queue beitreten kann, schickt der Angular-Service eine Anfrage an eine Route
> die im NestJS-Controller hinterlegt ist / an ein WebSocket-Gateway. In diesem Fall an den queue.controller. <br>
> Die Anfrage wird weiter im Service (queue.service) bearbeitet, wo auch relevante Inhalte über TypeORM aus der
> SQLite-Datenbank ausgelesen werden. Dann wird entweder das erfolgreiche Resultat ausgeben, dass der Nutzer der Queue
> erfolgreich beigetreten ist (oder sogar einen Gegner gefunden hat) oder ein Fehler. <br>
> Das erfolgreiche Ergebnis oder der Fehler wird über das WebSocket-Gateway oder den Controller an den Client
> zurückgegeben.


Diese Aufteilung soll eine einfachere Navigation durch das Projekt ermöglichen um schneller die benötigten Ressourcen
finden zu können.

Einige dieser Ordner beinhalten eine DELETE.ME-Datei, rein aus dem Zweck um beim Pushen ins Git die Komponenten-Struktur
aufrechtzuerhalten, da sonst leere Ordner nicht mitgesendet werden.