/**
 * Input state container for keyboard controls.
 *
 * Responsibilities:
 * - Holds boolean flags for game-relevant keys.
 * - Flags are set/reset externally by `keydown` / `keyup` listeners.
 *
 * Notes:
 * - Default: all flags = false.
 * - Keys: arrows (← → ↑ ↓), Space (jump), D (throw).
 */
class Keyboard {
  LEFT = false;  
  RIGHT = false;  
  UP = false;     
  DOWN = false;   
  SPACE = false;  
  D = false;     
}
