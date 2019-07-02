import { Selector } from '@brandingbrand/fscomponents';

/**
 * A Selector that doesn't update its internal value when selecting values
 *
 * This can be used for making a selector list that links out to another screen. By not updating
 * the internal value, the proper option is still selected when returning to the initial screen.
 */
export default class FauxSelector extends Selector {
  chooseItem = (value: any) => {
    return () => {
      this.closeModal();
      if (this.props.onValueChange) {
        this.props.onValueChange(value);
      }
    };
  }
}
