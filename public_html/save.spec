List of keys, their intended use, and type of value expected:

Key: <LEVEL_ID> identified by "LEVEL_*"
Description: The stats for a level
Value: {best: <BEST_VALUE>}

Key: currentLevel
Description: The most recently played level
Value: {index: <INDEX> (eg 0, 1, 2), progress: <LEVEL_OBJECT>}

Key: addTable
Description: Contains the Facts a user has created
value: {
        AT1: <FACT_AS_PARSABLE_STRING>,
        AT2: <FACT_AS_PARSABLE_STRING>,
        AT3: <FACT_AS_PARSABLE_STRING>,
        AT4: <FACT_AS_PARSABLE_STRING>,
        AT5: <FACT_AS_PARSABLE_STRING>
        }