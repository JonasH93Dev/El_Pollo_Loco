// levels/level1.js

let level1;

/**
 * Utility to create an array of N new instances.
 * @template T
 * @param {new () => T} Ctor - Class constructor.
 * @param {number} n - Number of instances to create.
 * @returns {T[]} Array with n new instances.
 */
function makeN(Ctor, n) {
  return Array.from({ length: n }, () => new Ctor());
}

/**
 * Builds the repeating background sequence for x ∈ [-719, 0, 719, 1438, 2157].
 * Alternates layer variant 2,1,2,1,2 while air.png stays constant.
 * @returns {BackgroundObject[]} Background objects in draw order.
 */
function buildBackground() {
  const xs = [-719, 0, 719, 719 * 2, 719 * 3];
  const out = [];
  xs.forEach((x, i) => {
    const v = i % 2 === 0 ? 2 : 1;
    out.push(new BackgroundObject("img/5_background/layers/air.png", x));
    out.push(new BackgroundObject(`img/5_background/layers/3_third_layer/${v}.png`, x));
    out.push(new BackgroundObject(`img/5_background/layers/2_second_layer/${v}.png`, x));
    out.push(new BackgroundObject(`img/5_background/layers/1_first_layer/${v}.png`, x));
  });
  return out;
}

/**
 * Initializes level 1 with enemies, boss, collectibles, clouds, and background.
 * Keeps counts identical: 5 Chickens, 5 Small Chickens, 1 Endboss, 8 Coins,
 * 8 Bottles, 5 Clouds, and the same background tiling.
 */
function initLevel() {
  level1 = new level(
    [...makeN(Chicken, 5), ...makeN(ChickenSmall, 5)],
    [new Endboss()],
    makeN(Coin, 8),
    makeN(Bottle, 12),
    makeN(Cloud, 5),
    buildBackground()
  );
}
