let level1;

/**
 * Builds one background row (air, third, second, first layer) at x.
 * @param {number} x - X offset in px.
 * @param {1|2} variant - Image variant suffix (1 or 2).
 * @returns {BackgroundObject[]} Four layered background objects.
 */
function bgRow(x, variant) {
  return [
    new BackgroundObject("img/5_background/layers/air.png", x),
    new BackgroundObject(`img/5_background/layers/3_third_layer/${variant}.png`, x),
    new BackgroundObject(`img/5_background/layers/2_second_layer/${variant}.png`, x),
    new BackgroundObject(`img/5_background/layers/1_first_layer/${variant}.png`, x),
  ];
}

/**
 * Initializes level 1 with enemies, boss, collectibles, clouds, and background.
 */
function initLevel() {
  const enemies = [...Array(5)].map(() => new Chicken())
    .concat([...Array(5)].map(() => new ChickenSmall()));
  const coins = [...Array(8)].map(() => new Coin());
  const bottles = [...Array(8)].map(() => new Bottle());
  const clouds = [...Array(5)].map(() => new Cloud());
  const bg = [-719, 0, 719, 719 * 2, 719 * 3].flatMap((x, i) => bgRow(x, i % 2 ? 1 : 2));
  level1 = new level(enemies, [new Endboss()], coins, bottles, clouds, bg);
}
