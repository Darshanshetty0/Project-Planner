import { Component } from 'react';
import { RangeSelector} from 'grommet';

export default class extends Component{
  state = { values: [2, 8] }

  render() {
    const { values } = this.state;
    return (
        <>
          <RangeSelector
            direction='horizontal'
            invert={false}
            min={0}
            max={9}
            size='full'
            round='small'
            color={'#000000'}
            values={values}
            onChange={nextValues => this.setState({ values: nextValues })}
          />
        </>
    );
  }
}
