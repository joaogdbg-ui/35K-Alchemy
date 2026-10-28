# V29.2 — English-only names policy

Every game-generated discovery, generic concept, UI label and recipe ingredient must use English. Existing immutable IDs, recipe relations and saved-game keys must **never** change during display-name edits.

Current migration: 175 earlier legacy names translated in `ENGLISH_NAME_MIGRATION.json`. Titles and proper nouns retain official spellings. All content expansions must be audited for untranslated common nouns and mixed English/Portuguese phrases. Run `python tools/check-english-catalog.py` and `python tools/build-standalone.py` after changing the catalog.
