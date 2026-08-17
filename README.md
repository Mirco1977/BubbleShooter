# BubbleShooter

Das ist ein Minigame V2 für bandenkick.de

Netlify live url: _comming soon..._
## Zentrale Stage-Verwaltung (ab v0.3.0)

Stage-Metadaten werden nur noch in `js/config/stageConfig.js` gepflegt.

Eine neue Stage wird dort am Ende von `STAGES` ergänzt:

```js
{ name: "Neue Stage", logo: "assets/logos/neue-stage.png", background: "assets/backgrounds/neue-stage.png", accent: "#860000" }
```

Die Stage-Nummer ergibt sich automatisch aus der Reihenfolge. `TOTAL_STAGES` und `TOTAL_LEVELS` werden automatisch berechnet. Endloskarte, Stage-Animation und Level-Hintergrund verwenden dieselbe zentrale Definition.

Die eigentliche Spieldefinition eines neuen Levels (Ziel, Farben, Speed/Time, Sterne usw.) bleibt wie bisher in `js/config/starConfig.js`.
