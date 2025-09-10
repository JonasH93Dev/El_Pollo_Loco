/**
 * Input state container for keyboard controls.
 *
 * Responsibilities:
 * - Stores boolean flags for specific keys that the game logic uses.
 * - Flags are toggled externally by keyboard event listeners
 *   (e.g., `keydown` sets a property to `true`, `keyup` sets it back to `false`).
 *
 * Notes:
 * - This class only holds state; it does not register or handle events itself.
 * - Properties default to `false` (not pressed).
 */
class Keyboard {
  /** Left arrow key pressed state. */
  LEFT = false;

  /** Right arrow key pressed state. */
  RIGHT = false;

  /** Up arrow key pressed state. */
  UP = false;

  /** Down arrow key pressed state. */
  DOWN = false;

  /** Space bar pressed state (commonly used for jump). */
  SPACE = false;

  /** "D" key pressed state (used for throw or special actions). */
  D = false;
}
