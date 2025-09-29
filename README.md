Hi!

WHAT'S THAT SCRIPT:
It currently checks 'footage' issues:
  - FOOTAGE "UNPROPERLY LOCATED' (which means, not located in the '(Footage)' Folder near the project's file);
  - BROKEN LINKS (Missing files)
  - THERE IS NO FOOTAGE FOLDER
... but not in just one .aep file. It performs that check on ALL after effects projects found in a folder.
For that : the place where you execute the folder must be this way:
"CHOSEN FOLDER":
  -> FOLDER 1:
      - afterEffectsProjectX_PRECOMP_v01.aep (example name)
 -> FOLDER 2:
      - afterEffectsProjectZ_COMP_v03.aep (example name)
Currently, for a .aep to be considered as "to process", there is only 1 condition: its name matching this Regular Expression : /(PRECOM(P|PO))|(COM(P|PO))_v\d{2}/ig;
To change this condition, go to UTILITARIES/batchMenu_v02.jsx , line 36


TO LAUNCH THE SCRIPT:
-> Run script in After effects:
collectFiles_OnABatch_part_01_v01.jsx



This one will use:
- UTILITARIES/batchMenu_v02.jsx to display one window then another -> tell WHERE (script will execute + where report will be saved);
- UTILITARIES/collectFiles_v01_forBatchUseOnly_v02.jsx -> to know WHAT to do in the found .aep files;

Why this structure in three scripts?
In order to be able to re-use things.
* The script UTILITARIES/collectFiles_v01_forBatchUseOnly_v02.jsx could be replaced by another;
  ...It would imply some changes, but not fondamental, to collectFiles_OnABatch_part_01_v01.jsx;
* UTILITARIES/batchMenu_v02.jsx could be not changed at all;

Others things provided here:
- UTILITARIES/REPORTS_collectFiles_OnABatch_part_01_v01 is a folder that will be default report file location;
- UTILITARIES/doNotTouch_templateForBatchReportFile.txt is an empty .txt file, used as as basis to initialize the report;
- HISTORY_collectFiles_OnABatch_part_01_v01 serves as history for collectFiles_OnABatch_part_01_v01.jsx
  ... so it stores and allow script to access every adress where script was used ;
- UTILITARIES/shorterFormForArray.jsx is to get the report(displayed at the end of collectFiles_OnABatch_part_01_v01) in a more readable and very much shorter form;
- UTILITARIES/getTvShowName.jsx : in my company this program was used on two different servers and i wanted the script to recognize on which it was used;

ADDITIONAL : LAUNCH THE 'WHAT' SCRIPT (UTILITARIES/collectFiles_v01_forBatchUseOnly_v02.jsx) IN ONLY ONE FILE, CURRENTLY OPENED IN AFTER EFFECTS:
- callAScript_forOneFile_collectFiles_v01_forBatchUseOnly_v02_REPAIR.jsx;
  ... repairs issues;
- callAScript_forOneFile_collectFiles_v01_forBatchUseOnly_v02_CHECK_ONLY.jsx;
  ... does not repairs but dislay whole info about found issues;
