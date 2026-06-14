#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genere un PDF recap (sans dependance externe). Polices Helvetica standard."""

# (style, texte) — styles: h1, h2, body, bullet, space, rule
CONTENT = [
    ("h1", "Seed to Bloom — Recapitulatif des demandes"),
    ("meta", "Espace client & panel admin — 14 juin 2026"),
    ("rule", ""),

    ("h2", "1. Corrections de bugs"),
    ("bullet", "Erreur \"totalMm is not defined\" qui rendait les onglets Suivi / Client blancs."),
    ("bullet", "Grand bloc vide au-dessus du contenu des onglets Suivi / Client (div mal fermee)."),
    ("bullet", "Texte des boutons invisible (fond fonce) : couleur de bouton decouplee de la sidebar."),
    ("bullet", "Impossible de cliquer sur un jour du calendrier contenant une tache : corrige."),
    ("bullet", "Telechargement de fichier \"not found\" : la cle des fichiers deposes par le client"),
    ("cont", "etait mal lue cote serveur (prefixe projects/...). Corrige."),
    ("bullet", "Erreur a la suppression d'un espace client : la route DELETE n'etait pas routee. Corrige."),
    ("space", ""),

    ("h2", "2. Espace client (portail)"),
    ("bullet", "Le document/hub partage est devenu une SECTION distincte \"Ressources\" dans le menu."),
    ("bullet", "Page d'accueil centree (ni trop a gauche, ni trop a droite) via largeur max."),
    ("bullet", "Espace messagerie agrandi : pleine largeur et hauteur dynamique (avant trop petit)."),
    ("bullet", "Section dediee au depot de fichiers + telechargement fonctionnel."),
    ("bullet", "Cartes de taches redesignees : deadline, \"Fait le\", statut, fond creme."),
    ("bullet", "Changement de statut directement depuis la carte (selecteur), sans ouvrir Modifier."),
    ("bullet", "Texte du code d'acces plus chaleureux : mention de Cindy et du studio Seed to Bloom."),
    ("space", ""),

    ("h2", "3. Mode edition / Page builder"),
    ("bullet", "Constructeur de page pour l'espace client, tres flexible :"),
    ("cont", "- ajout / suppression / deplacement de sections par glisser-deposer ;"),
    ("cont", "- mise en page en 1 ou 2 colonnes (grille) ;"),
    ("cont", "- blocs de contenu : titre, texte, liste, separateur, image, mini-banniere ;"),
    ("cont", "- sections : etapes, cartes, fichiers, questionnaire, infos pratiques, etc. ;"),
    ("cont", "- bouton Enregistrer."),
    ("bullet", "Acces au mode edition via un bouton \"Personnaliser\" dans la fiche projet admin."),
    ("cont", "Le portail s'ouvre sur le meme domaine que l'admin pour transmettre la session."),
    ("space", ""),

    ("h2", "4. Panel admin"),
    ("bullet", "Controle des couleurs : fond et texte des boutons (principal / secondaire) personnalisables."),
    ("bullet", "Suppression definitive d'un espace client (en plus de la simple revocation)."),
    ("bullet", "Barre de tri / filtres du dashboard rendue plus compacte (prend moins de place)."),
    ("bullet", "Pastille de messages non lus visible sur le menu \"Messages\" dans toutes les vues,"),
    ("cont", "pour savoir immediatement quand un client a ecrit."),
    ("space", ""),

    ("h2", "5. Contraintes de design respectees"),
    ("bullet", "Pas de degrades."),
    ("bullet", "Fleches autorisees ; pas de points, privilegier les icones."),
    ("bullet", "Pas de references au design \"IA\" (bordures laterales au focus/survol, emojis etoile)."),
    ("bullet", "Titres sans accents."),
    ("bullet", "Tout changement applique a la fois cote admin et cote espace client."),
    ("space", ""),

    ("rule", ""),
    ("meta", "Document genere automatiquement — branche claude/practical-brahmagupta-0Wxco"),
]

# ---- Generateur PDF minimal ----
def esc(s):
    return s.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")

PAGE_W, PAGE_H = 595, 842  # A4 en points
MARGIN_L = 60
MARGIN_T = 790
MARGIN_B = 60
LEADING = 16

STYLES = {
    "h1":   ("Helvetica-Bold", 20, 24, 0.04, 0.13, 0.24),
    "h2":   ("Helvetica-Bold", 14, 22, 0.16, 0.10, 0.06),
    "meta": ("Helvetica-Oblique", 10, 16, 0.5, 0.5, 0.5),
    "body": ("Helvetica", 11, 16, 0.1, 0.1, 0.1),
    "bullet": ("Helvetica", 11, 16, 0.1, 0.1, 0.1),
    "cont": ("Helvetica", 11, 16, 0.25, 0.25, 0.25),
}

CHAR_W = 0.52  # approximation largeur moyenne

def wrap(text, font_size, max_w, indent=0):
    avail = max_w - indent
    max_chars = max(8, int(avail / (font_size * CHAR_W)))
    words = text.split(" ")
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if len(trial) <= max_chars:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines or [""]

def build():
    pages = []
    ops = []
    y = MARGIN_T

    def new_page():
        nonlocal ops, y
        if ops:
            pages.append(ops)
        ops = []
        y = MARGIN_T

    for style, text in CONTENT:
        if style == "space":
            y -= 8
            continue
        if style == "rule":
            if y < MARGIN_B + 20:
                new_page()
            ops.append(("rule", y - 4))
            y -= 14
            continue

        font, size, lead, r, g, b = STYLES.get(style, STYLES["body"])
        indent = 0
        prefix = ""
        if style == "bullet":
            prefix = ">  "
        if style == "cont":
            indent = 16
        if style in ("h1", "h2"):
            y -= 6

        full = prefix + text
        lines = wrap(full, size, PAGE_W - MARGIN_L * 2, indent)
        for i, ln in enumerate(lines):
            if y < MARGIN_B + lead:
                new_page()
            x = MARGIN_L + indent + (12 if (style == "bullet" and i > 0) else 0)
            ops.append(("text", x, y, font, size, r, g, b, ln))
            y -= lead
    new_page()
    return pages

def render(pages):
    objs = []
    # 1: catalog, 2: pages tree, then per page: page obj + content obj, + 4 fonts at end
    n_pages = len(pages)
    font_objs = {
        "Helvetica": None, "Helvetica-Bold": None, "Helvetica-Oblique": None,
    }
    # Object numbering
    catalog_id = 1
    pages_id = 2
    page_ids = []
    content_ids = []
    nid = 3
    for _ in range(n_pages):
        page_ids.append(nid); nid += 1
        content_ids.append(nid); nid += 1
    font_ids = {}
    for fname in font_objs:
        font_ids[fname] = nid; nid += 1

    def stream_for(ops):
        out = ["BT"]
        cur_font = None
        for op in ops:
            if op[0] == "text":
                _, x, yv, font, size, r, g, b, txt = op
                out.append(f"{r:.3f} {g:.3f} {b:.3f} rg")
                out.append(f"/{_short(font)} {size} Tf")
                out.append(f"1 0 0 1 {x} {yv} Tm")
                out.append(f"({esc(txt)}) Tj")
        out.append("ET")
        # rules drawn as lines (outside BT/ET)
        line_ops = [op for op in ops if op[0] == "rule"]
        extra = []
        for op in line_ops:
            yv = op[1]
            extra.append("0.8 0.8 0.8 RG")
            extra.append(f"{MARGIN_L} {yv} m {PAGE_W-MARGIN_L} {yv} l S")
        return "\n".join(out + extra)

    def _short(font):
        return {"Helvetica": "F1", "Helvetica-Bold": "F2", "Helvetica-Oblique": "F3"}[font]

    objects = {}
    objects[catalog_id] = f"<< /Type /Catalog /Pages {pages_id} 0 R >>"
    kids = " ".join(f"{pid} 0 R" for pid in page_ids)
    objects[pages_id] = f"<< /Type /Pages /Count {n_pages} /Kids [{kids}] >>"

    font_res = " ".join(f"/{_short(f)} {font_ids[f]} 0 R" for f in font_objs)
    for i in range(n_pages):
        objects[page_ids[i]] = (
            f"<< /Type /Page /Parent {pages_id} 0 R /MediaBox [0 0 {PAGE_W} {PAGE_H}] "
            f"/Resources << /Font << {font_res} >> >> /Contents {content_ids[i]} 0 R >>"
        )
        body = stream_for(pages[i]).encode("latin-1", "replace")
        objects[content_ids[i]] = ("STREAM", body)

    base_fonts = {"Helvetica": "Helvetica", "Helvetica-Bold": "Helvetica-Bold", "Helvetica-Oblique": "Helvetica-Oblique"}
    for fname, fid in font_ids.items():
        objects[fid] = (f"<< /Type /Font /Subtype /Type1 /BaseFont /{base_fonts[fname]} "
                        f"/Encoding /WinAnsiEncoding >>")

    # Serialize
    out = bytearray()
    out += b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"
    offsets = {}
    for oid in sorted(objects):
        offsets[oid] = len(out)
        val = objects[oid]
        out += f"{oid} 0 obj\n".encode("latin-1")
        if isinstance(val, tuple) and val[0] == "STREAM":
            data = val[1]
            out += f"<< /Length {len(data)} >>\nstream\n".encode("latin-1")
            out += data + b"\nendstream"
        else:
            out += val.encode("latin-1")
        out += b"\nendobj\n"
    xref_pos = len(out)
    n_objs = max(objects) + 1
    out += f"xref\n0 {n_objs}\n".encode("latin-1")
    out += b"0000000000 65535 f \n"
    for oid in range(1, n_objs):
        out += f"{offsets.get(oid,0):010d} 00000 n \n".encode("latin-1")
    out += f"trailer\n<< /Size {n_objs} /Root {catalog_id} 0 R >>\nstartxref\n{xref_pos}\n%%EOF".encode("latin-1")
    return bytes(out)

if __name__ == "__main__":
    pages = build()
    pdf = render(pages)
    with open("/home/user/dashboard/Recap_SeedToBloom.pdf", "wb") as f:
        f.write(pdf)
    print("OK", len(pdf), "bytes,", len(pages), "page(s)")
