List of keys, their intended use, and type of value expected:

Key: saveGame
Description: Indicate if there is any save data. first key to check.
Value: "true"

Key: <LEVEL_ID> identified by "LEVEL_*"
Description: The stats for a level
Value: {best: <BEST_VALUE>}

Key: currentLevel
Description: The most recently played level
Value: {index: <INDEX> (eg 0, 1, 2), progress: <LEVEL_OBJECT>}