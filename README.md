# N'oubliez Pas Les Paroles !

Interface du jeu développée en React. L'application est en deux parties : une première pour les joueur·ses diffusée sur un grand écran et une bonne paire d'enceinte, la seconde est la régie et sert a controler le déroulement du jeu.

![Intro](intro.gif)

## Build

Depuis la racine du projet :

```shell
docker build . -t noplp
```

## Utilisation

Demarrer le server : 

```shell
docker run --rm -p 8080:8080 noplp
```

Depuis un navigateur (Firefox) : [http://localhost:8080](http://localhost:8080) affichera l'interface de jeu.  [http://localhost:8080/controller](http://localhost:8080/controller) affichera l'interface de commande (regie).
