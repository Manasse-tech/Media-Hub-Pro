# Media Player — film produit

## Traitement

- **Promesse :** rassembler ses médias dans un lecteur clair, avec les fichiers importés conservés sur l’appareil.
- **Public :** personnes qui veulent écouter leurs pistes et retrouver leurs vidéos locales sur mobile.
- **Format :** 16:9 paysage, choisi pour YouTube et les présentations.
- **Durée :** 24 secondes, cinq scènes enchaînées.
- **Identité :** fond nuit `#090b18`, cyan `#61e7e8`, corail `#ff8066`, texte blanc. Titres Space Grotesk; détails DM Sans et JetBrains Mono.
- **Héros :** l’interface de bibliothèque et de lecture, traitée comme une composition graphique en mouvement, pas comme une capture qui prétend montrer un test natif.
- **Mouvement :** mots cinétiques courts, cartes d’interface qui se déplient et se recomposent, formes circulaires qui traversent les raccords. Les compositions alternent plein cadre, vue de bibliothèque et écran de lecture.
- **Arc :** accroche immédiate, import local, organisation, lecture, puis confirmation de confidentialité.
- **Finale :** les formes de l’interface se simplifient en une signature typographique calme, avant que son anneau cyan redevienne l’ouverture.
- **Son :** une seule musique instrumentale électronique sobre, sans voix ni effets sonores ajoutés. Aucun calage sur des temps musicaux n’est promis avant l’écoute du morceau généré.
- **Limite de représentation :** les écrans sont des illustrations animées basées sur les fonctions visibles dans le code du produit. La vidéo ne prétend pas démontrer une performance native ni une fonction système testée sur appareil.

## Vue d’ensemble

| Scène | Temps | Idée | Action principale | Raccord |
| --- | --- | --- | --- | --- |
| 01 — À vous | 00:00.00–00:04.20 (4,20 s) | Vos médias dans votre espace | Une onde s’ouvre en anneau, puis le titre prend le cadre | L’anneau devient le repère du fichier importé |
| 02 — Importer | 00:04.20–00:08.60 (4,40 s) | Import depuis l’appareil | Une tuile-fichier se déplie en pistes audio et vidéo | La tuile se transforme en disque repère de la bibliothèque |
| 03 — Bibliothèque | 00:08.60–00:13.50 (4,90 s) | Retrouver ses contenus | Les filtres réorganisent une liste de médias | La vignette audio devient la pochette de lecture |
| 04 — Lecture | 00:13.50–00:19.20 (5,70 s) | Audio et vidéo, dans le même lecteur | L’artwork se déploie en lecteur audio, puis en cadre vidéo | Le cadre vidéo se scinde en deux panneaux de couleur |
| 05 — Sur l’appareil | 00:19.20–00:24.00 (4,80 s) | Les imports restent locaux | Les panneaux se rassemblent autour du message de confidentialité | Un anneau cyan revient à la taille et à la position de l’ouverture |

## Script complet

### Scène 01 — « À VOUS. »

**Temps :** 00:00.00–00:04.20, 4,20 s.  
**But :** annoncer immédiatement le sujet et installer un lecteur personnel, pas un service de streaming.

**Texte exact et maintien :**
- `VOS MÉDIAS.` à 00:00.08; lisible jusqu’à 00:01.42.
- `À VOUS.` à 00:01.48; lisible jusqu’au raccord à 00:04.20.
- `LECTEUR AUDIO & VIDÉO` apparaît à 00:02.25 dans un petit repère, conservé jusqu’à 00:04.20.

**Composition et idée visuelle :** fond nuit. Une ligne cyan d’onde traverse le cadre à hauteur médiane. Elle s’enroule en anneau ouvert autour d’un point corail; les mots sont grands, blancs, ancrés dans la zone gauche. Une fine grille de repères audio occupe l’arrière-plan sans traverser les mots.

**Chorégraphie :** 00:00.00–00:00.18, le premier trait et la première lettre apparaissent dès l’ouverture. 00:00.18–00:00.60, l’onde frappe le centre en trois impulsions brèves, avec des intervalles d’environ 0,20 s. 00:00.62–00:01.20, `VOS MÉDIAS.` se révèle par masque vertical pendant que la ligne passe derrière le titre. 00:01.48–00:01.90, `À VOUS.` remplace le titre par contraction et changement d’échelle, pas par défilement. 00:02.25–00:03.30, l’anneau s’ouvre autour de `LECTEUR AUDIO & VIDÉO` et deux fines pistes s’alignent sous le libellé. 00:03.30–00:03.48, composition nette et lisible. 00:03.48–00:04.20, l’anneau effectue une poussée en perspective et s’élargit pour préparer le raccord.

**Raccord :** le point corail et l’anneau cyan restent au centre. Pendant leur poussée, le bord de l’anneau se redresse en languette de fichier dans la scène 02; un masque oblique et un bref flou de mouvement accompagnent la mise à l’échelle. La nouvelle scène commence avant la fin de cette sortie.

**Médias et technique :** formes vectorielles déterministes, texte masqué, grille et onde CSS/SVG. Aucun visuel généré.

**Intention sonore :** la musique commence avec une attaque nette; ne pas prétendre que les impulsions sont synchronisées à un morceau avant vérification.

### Scène 02 — « IMPORTER. »

**Temps :** 00:04.20–00:08.60, 4,40 s.  
**But :** montrer une action concrète, l’import de médias depuis l’appareil.

**Texte exact et maintien :**
- `IMPORTER.` à 00:04.36, visible jusqu’à 00:07.68.
- `Depuis votre appareil.` à 00:05.16, visible jusqu’à 00:07.90.
- Les étiquettes `AUDIO` et `VIDÉO` apparaissent respectivement à 00:06.18 et 00:06.52, maintenues jusqu’au raccord.

**Composition et idée visuelle :** grande tuile sombre à droite, ouverte en perspective sur un champ corail; titre à gauche. Le même anneau cyan reste au centre de la tuile comme un repère de sélection. Deux rubans de fichiers, un étroit pour l’audio et un large pour la vidéo, se déplient hors de la tuile sans ressembler à des boutons d’action.

**Chorégraphie :** 00:04.20–00:04.55, la tuile apparaît déjà en cadre tandis que l’anneau termine sa poussée. 00:04.55–00:05.00, le bord se plie en volet, révélant une icône de fichier stylisée. 00:04.36–00:05.12, `IMPORTER.` s’inscrit lettre par lettre en grande taille. 00:05.16–00:05.65, la phrase secondaire se révèle dans un espace distinct. 00:05.82–00:06.18, une bande audio se déplie vers le bas et révèle `AUDIO`. 00:06.32–00:06.72, un cadre plus large se déplie vers le haut et révèle `VIDÉO`. 00:06.72–00:07.35, les deux bandes s’alignent comme deux éléments de bibliothèque. 00:07.35–00:07.60, léger recul de caméra pour rendre l’ensemble lisible. 00:07.60–00:08.60, la tuile pivote en disque graphique et démarre un zoom de sortie.

**Raccord :** le disque issu de la tuile garde son centre et son diamètre pendant qu’un volet en deux panneaux dévoile la bibliothèque. Le titre sort par une tranche floutée; le disque reste visible comme vignette dans l’ouverture de la scène 03.

**Médias et technique :** tuile d’interface construite en HTML/CSS, icônes vectorielles, volet en perspective et dépliage de deux fichiers. Le visuel reste une illustration de l’action d’importer, pas un écran d’import natif.

**Intention sonore :** poursuivre le même lit instrumental; pas de clic ou de son d’interface ajouté.

### Scène 03 — « TRIEZ. RETROUVEZ. »

**Temps :** 00:08.60–00:13.50, 4,90 s.  
**But :** montrer une bibliothèque filtrable, avec des médias audio et vidéo.

**Texte exact et maintien :**
- `TRIEZ.` à 00:08.72, remplacé à 00:09.52.
- `RETROUVEZ.` à 00:09.52, visible jusqu’à 00:12.20.
- Les libellés de filtre `TOUT`, `MUSIQUE`, `VIDÉOS`, `FAVORIS` apparaissent l’un après l’autre de 00:10.10 à 00:10.72 et restent visibles jusqu’à 00:13.12.
- `UNE BIBLIOTHÈQUE POUR VOS MÉDIAS` à 00:11.26, conservé jusqu’à 00:13.10.

**Composition et idée visuelle :** vue de dessus, asymétrique. Des bandes de liste larges et très lisibles occupent les deux tiers droits; les titres, plus grands, sont dans le tiers gauche. Une vignette audio abstraite cyan/corail et une vignette vidéo de paysage fournies avec le projet identifient les deux types. Les filtres sont des repères non interactifs, illustrant les options vérifiées `Tout`, `Musique`, `Vidéos` et `Favoris`.

**Chorégraphie :** 00:08.60–00:09.02, le disque du raccord devient la première vignette et révèle trois rangées par rotation de masque. 00:08.72–00:09.38, `TRIEZ.` entre par coupe d’échelle. 00:09.52–00:10.02, `RETROUVEZ.` prend sa place avec un changement vertical, sans reflow de la colonne. 00:10.10–00:10.72, les quatre filtres s’alignent un à un au-dessus des rangées; le filtre corail se déplace en premier plan. 00:10.94–00:11.22, la liste se compacte et inverse l’ordre de deux cartes pendant que le filtre sélectionné change, pour rendre le filtrage intelligible. 00:11.26–00:11.80, le sous-titre se révèle à gauche, sans chevaucher les filtres. 00:11.82–00:12.60, l’image des cartes s’agrandit puis se recadre; leur séparation verticale se resserre en une seule grande pochette. 00:12.60–00:13.50, poussée vers la vignette audio, avec rotation de la colonne et masque diagonal en amorce.

**Raccord :** la vignette cyan/corail s’agrandit jusqu’à devenir la pochette carrée du lecteur audio. En même temps, le bord gauche de la liste se redresse en panneau vidéo derrière elle; les deux plans se chevauchent brièvement à l’entrée de la scène 04.

**Médias et technique :** petites images existantes du projet, cartes dessinées en HTML/CSS, filtres représentés comme de simples étiquettes visuelles, masques et recadrages. Ne pas afficher de barre de recherche ni de tri qui ne sont pas attestés dans l’écran de bibliothèque observé.

**Intention sonore :** musique continue; les changements de filtre sont visuels, sans clic ajouté.

### Scène 04 — « AUDIO. VIDÉO. LECTURE. »

**Temps :** 00:13.50–00:19.20, 5,70 s.  
**But :** rendre tangible l’écran de lecture audio et vidéo sans faire de promesse de compatibilité système.

**Texte exact et maintien :**
- `AUDIO.` à 00:13.66, remplacé à 00:14.28.
- `VIDÉO.` à 00:14.28, remplacé à 00:14.90.
- `LECTURE.` à 00:14.90, visible jusqu’à 00:17.18.
- Les étiquettes visuelles `PRÉCÉDENT`, `LECTURE`, `SUIVANT` apparaissent à 00:16.05 sous forme d’icônes et d’un bouton central, puis disparaissent à 00:18.15. Elles ne sont pas présentées comme des actions testées sur appareil.
- `AVANCEZ À VOTRE RYTHME` à 00:17.20, visible jusqu’à 00:18.72.
- Un marqueur visuel `1×` apparaît à 00:17.78 et reste jusqu’à 00:18.70.

**Composition et idée visuelle :** la pochette carrée domine le centre-gauche; un rail de progression lumineux est installé au premier plan. L’image carrée se déploie ensuite en cadre 16:9 avec la photographie vidéo du projet. Des signes de transport et une valeur de vitesse reprennent les commandes de lecture représentées dans le code, mais sans simuler de sortie de verrouillage d’écran, de contrôle système, de lecture en arrière-plan ou de compatibilité PiP.

**Chorégraphie :** 00:13.50–00:13.90, arrivée de la pochette par échelle et masque circulaire; le panneau vidéo reste comme contrechamp flou, sans masquer le visuel. 00:13.66–00:14.16, `AUDIO.` apparaît en très grand; une onde se trace en arc, puis s’aplatit en ligne de progression. 00:14.28–00:14.78, `VIDÉO.` remplace le mot au moment où la pochette se redresse et devient un cadre panoramique. 00:14.90–00:15.36, `LECTURE.` se cale en haut du cadre. 00:15.40–00:16.04, la photographie se déplie dans le cadre vidéo; le contour orange devient la ligne de progression au premier plan. 00:16.05–00:16.70, les repères de transport et le bouton de lecture surgissent en séquence, sans interaction de curseur. 00:16.72–00:17.16, la progression se remplit par un balayage de gauche à droite. 00:17.20–00:17.78, la phrase secondaire s’ouvre sous le cadre tandis que `1×` se révèle séparément. 00:17.78–00:18.38, bref changement de vitesse de la typographie uniquement; l’image reste stable et lisible. 00:18.38–00:18.64, arrêt sur une composition nette. 00:18.64–00:19.20, le cadre se coupe en deux volets inclinés qui sortent en profondeur et préparent la scène finale.

**Raccord :** deux volets issus du cadre vidéo deviennent les deux champs cyan et corail de la scène 05. Le repère de lecture circulaire demeure entre eux; sa couleur et sa position sont conservées pendant l’ouverture en perspective.

**Médias et technique :** les images `album-neon.jpg` et `film-desert.jpg` du projet; boîte d’interface graphique, rail de progression, formes de transport, transition carrée-vers-panoramique, split en perspective. Tout contrôle est une illustration non interactive.

**Intention sonore :** la musique peut se développer sur la révélation du cadre; aucun synchronisme musical ne sera revendiqué sans écoute et vérification.

### Scène 05 — « SUR CET APPAREIL. »

**Temps :** 00:19.20–00:24.00, 4,80 s.  
**But :** conclure sur le détail concret de confidentialité des médias importés.

**Texte exact et maintien :**
- `VOS IMPORTS RESTENT` à 00:19.38, visible jusqu’à 00:20.34.
- `SUR CET APPAREIL.` à 00:20.38, visible jusqu’à 00:23.22.
- `Aucun envoi automatique dans le cloud.` à 00:21.18, visible jusqu’au départ de la scène à 00:24.00.
- `MEDIA PLAYER` à 00:21.92, signature en Space Grotesk, conservée jusqu’à 00:23.70.
- Petit libellé `LECTEUR AUDIO & VIDÉO` à 00:22.28, conservé jusqu’à 00:23.60.

**Composition et idée visuelle :** inversion par rapport à l’ouverture. Fond presque noir, deux champs latéraux étroits cyan et corail issus des volets vidéo. Le texte blanc est centré en bloc sur deux lignes, suffisamment grand pour être lu sans son. Les champs se replient vers une forme d’anneau autour du texte; la finale n’est ni une dernière fiche de fonctionnalité, ni un bouton d’appel à l’action.

**Chorégraphie :** 00:19.20–00:19.60, les deux volets se replient vers l’extérieur pour révéler le fond noir. 00:19.38–00:20.00, `VOS IMPORTS RESTENT` se compose par masque depuis les bords. 00:20.38–00:20.92, `SUR CET APPAREIL.` prend le centre par une poussée mesurée. 00:21.18–00:21.70, la phrase de confidentialité se révèle à plus petite échelle mais reste lisible. 00:21.92–00:22.36, `MEDIA PLAYER` apparaît dans un lockup typographique simple; il n’utilise pas de logo redessiné. 00:22.28–00:22.66, le libellé audio/vidéo se pose sous la marque. 00:22.66–00:23.20, tous les éléments sont lisibles, sans nouvel ornement. 00:23.20–00:24.00, le texte se retire en masque tandis que l’anneau cyan se réduit au centre et continue une légère rotation; son rayon final, sa position et son orientation correspondent à la première image du film pour un retour visuel propre au début de boucle.

**Raccord :** le dernier anneau cyan est au même centre et avec la même orientation que l’anneau d’ouverture. À la boucle, il s’ouvre en onde derrière `VOS MÉDIAS.`. Cette continuité est visuelle; aucun export final n’est présumé avant rendu.

**Médias et technique :** champs colorés issus du split précédent, lockup typographique, anneau SVG déterministe, masques. Aucun visuel généré.

**Intention sonore :** laisser la musique résoudre sa dernière phrase avant la reprise; la durée et la transition de la piste seront vérifiées après génération.

## Contrôle de variété et de rythme avant implémentation

- Les cinq scènes changent de cadrage ou de mécanisme : onde plein cadre, tuile qui se déplie, bibliothèque vue de dessus, pochette-vers-cadre, lockup inversé.
- Chaque scène a une action après son entrée et une préparation de raccord dans les derniers 15–20 % de son temps.
- Les messages essentiels sont visibles sans son; aucun écran n’est présenté comme capture réelle ni comme test natif.
- Les médias importés sont traités à part des morceaux d’exemple déjà fournis dans la bibliothèque.
- Les raccords conservent un objet identifiable et combinent échelle, masque, perspective ou split; pas de suite de balayages latéraux identiques.
- Le film dure exactement 24,00 secondes selon la somme des cinq scènes. Le minutage audio sera recalculé à partir de ces durées.
