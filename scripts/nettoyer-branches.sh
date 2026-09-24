#!/usr/bin/env bash
# Supprime les branches distantes qui ne portent plus rien.
#
# POURQUOI. Le dépôt accumulait 83 branches. Chacune a servi à une seule
# modification, a été fusionnée, et son étiquette est restée. Le travail, lui,
# est dans la branche déployée : ces étiquettes ne protègent donc rien.
#
# COMMENT. Pour chaque branche, on demande à git si elle porte un correctif que
# la branche déployée n'a pas (git cherry). Si la réponse est non, elle est
# supprimée. Sinon elle est GARDÉE et signalée. La vérification se refait à
# chaque exécution : ce script ne fait pas confiance à une liste écrite un jour
# donné, il regarde l'état réel.
#
#   bash scripts/nettoyer-branches.sh            # montre ce qui serait supprimé
#   bash scripts/nettoyer-branches.sh --pour-de-vrai
set -euo pipefail

DEPLOYEE="${DEPLOYEE:-claude/shared-session-zpw6l6}"   # la branche qui part en ligne
PROTEGEES="main ${DEPLOYEE}"
VRAI=0; [ "${1:-}" = "--pour-de-vrai" ] && VRAI=1

git fetch --quiet --prune origin
if ! git rev-parse --verify --quiet "origin/${DEPLOYEE}" >/dev/null; then
  echo "La branche déployée « ${DEPLOYEE} » est introuvable. Renseigne DEPLOYEE=..." >&2
  exit 1
fi

a_supprimer=(); a_garder=()
for ref in $(git for-each-ref --format='%(refname:short)' refs/remotes/origin | grep -v '^origin/HEAD$'); do
  b="${ref#origin/}"
  case " $PROTEGEES " in *" $b "*) continue ;; esac
  if git cherry "origin/${DEPLOYEE}" "$ref" 2>/dev/null | grep -q '^+'; then
    a_garder+=("$b")
  else
    a_supprimer+=("$b")
  fi
done

echo "Branche déployée : ${DEPLOYEE}"
echo "À supprimer (tout leur contenu y est déjà) : ${#a_supprimer[@]}"
for b in "${a_supprimer[@]}"; do printf '   %s  %s\n' "$(git rev-parse --short "origin/$b")" "$b"; done
if [ ${#a_garder[@]} -gt 0 ]; then
  echo
  echo "GARDÉES, elles portent encore quelque chose d'unique : ${#a_garder[@]}"
  for b in "${a_garder[@]}"; do printf '   %s  %s\n' "$(git rev-parse --short "origin/$b")" "$b"; done
fi

if [ $VRAI -eq 0 ]; then
  echo
  echo "Rien n'a été supprimé. Relance avec --pour-de-vrai pour le faire."
  exit 0
fi

# Les empreintes sont affichées ci-dessus : une branche supprimée par erreur se
# recrée avec « git branch <nom> <empreinte> && git push origin <nom> ».
for b in "${a_supprimer[@]}"; do
  echo "suppression de $b"
  git push origin --delete "$b"
done
echo "Terminé : ${#a_supprimer[@]} branche(s) supprimée(s)."
