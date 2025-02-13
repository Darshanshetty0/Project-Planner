import { Component } from 'react';
import { Box, Stack, Text } from 'grommet';
import SlotSliderRange from './SlotSliderRange';

export default class extends Component {

  render() {
    return (
        <>
        <Stack>
          <Box direction='row' justify='between'>
            {[0, '1am', 2, 3, 4, 5, 6, 7, 8, 9].map(value => (
              <Box key={value} pad='small' border={false}>
                <Text style={{ fontFamily: 'monospace' }}>{value}</Text>
              </Box>
            ))}
          </Box>
          <SlotSliderRange z-index = '0'/>
          <SlotSliderRange z-index = '0'/>
        </Stack>
        </>
    );
  }
}
