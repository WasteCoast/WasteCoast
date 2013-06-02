var in_weight_min,
    in_weight_max,
    coeff
  ;

exports = module.exports = {

  reset: function() {
    this.ready = false;

    in_weight_min = null;
    in_weight_max = null;
  },

  /**
   * Calibrate balance and return success
   *
   * @param w        weight expected in grams for actual input
   * @param inw      arduino input weight actual
   * @param inwmin   arduino input weight min, where weight equals 0
   * @param inwmax   arduino input weight max
   * @return bool
   */
  calibrate: function(w, inw, inwmin, inwmax) {

    this.ready = true;

    // Defines globals to calculate weight
    in_weight_min = inwmin;
    in_weight_max = inwmax;

    coeff = Math.round(parseFloat(w) / (parseFloat(inw) - parseFloat(in_weight_min)));

    console.log(w, parseFloat(inw) - parseFloat(in_weight_min), coeff);


    return true;
  },

  tare: function(inw) {
    in_weight_min = inw;
  },

  /**
   * @param inweight arduino input weight actual
   * @return int
   */
  getWeight: function(inw) {

    if (!this.ready) {
      return false;
    }

    console.log((inw - in_weight_min) * coeff);

    return {
      actual: parseInt((inw - in_weight_min) * coeff),
      in_min: inw <= in_weight_min,
      in_max: inw >= in_weight_max
    };
  },

  ready: false

};