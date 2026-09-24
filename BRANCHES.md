# Les branches : comment les nommer, et pourquoi il ne faut pas les garder

## L'état trouvé le 24 septembre 2026

83 branches, et un constat gênant : **aucune n'était fusionnée dans `main`**.
`main` est 380 commits derrière ce qui tourne réellement en ligne. Ce n'est
donc pas `main` qui fait foi, mais `claude/shared-session-zpw6l6`, une branche
au nom de session dont le nom est écrit en dur dans le fichier de déploiement.

Vérification faite branche par branche (`git cherry`), **81 des 83 ne portent
aucun correctif absent de la branche déployée**. Ce sont des étiquettes restées
après coup : elles ne protègent rien. Une seule porte encore quelque chose,
`claude/practical-brahmagupta-0Wxco`, et ce quelque chose ne touche qu'un
fichier `wFront.js` qui n'existe plus depuis la refonte de juin.

## Faire le ménage

    bash scripts/nettoyer-branches.sh               # montre ce qui partirait
    bash scripts/nettoyer-branches.sh --pour-de-vrai

Le script ne se fie à aucune liste écrite : il redemande à git, à chaque
exécution, si la branche porte un correctif absent de la branche déployée. Il
garde `main`, garde la branche déployée, garde tout ce qui a du contenu unique,
et affiche l'empreinte de chaque branche supprimée — une suppression par erreur
se défait avec `git branch <nom> <empreinte> && git push origin <nom>`.

## Comment nommer

Une branche sert à une chose et meurt avec elle. Son nom doit dire CE QU'ELLE
CHANGE, pas qui l'a écrite ni quand :

    projets/cards-couleurs
    taches/tiroir-lateral
    planning/jalons-lisibles
    fix/boutons-trop-gros

Le premier mot est l'écran ou le domaine concerné, le reste dit le changement,
en français, en minuscules, séparé par des tirets. Pas de nom de session, pas
d'identifiant aléatoire : `claude/inspiring-feynman-hzv6c1` ne dit rien à
personne, six mois plus tard, pas même à celle qui l'a créée.

Une branche se supprime dès qu'elle est fusionnée. C'est le seul moyen de ne
pas se retrouver à 83.

## Ce qui a été décidé, et fait

`main` redevient la vérité. Le 24 septembre 2026 :

- le commit que `main` avait en propre a été fusionné dans l'état déployé
  avant tout le reste, pour ne rien perdre. Il ne changeait rien : il corrigeait
  le contraste de couleurs qui n'existent plus depuis le passage à la charte.
  La fusion n'a donc modifié aucun fichier, et c'est vérifiable ;
- `main` a été amenée sur cet état ;
- `.github/workflows/deploy-v2.yml` n'écoute plus qu'une branche : `main`.

Ce qui part en ligne est donc, de nouveau, ce que `main` contient. Les branches
de travail repartent de `main` et y reviennent.
