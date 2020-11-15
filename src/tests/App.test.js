import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import sinon from 'sinon';
import App from '../App';
import SummaryComponent from '../SummaryComponent';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter })


// describe('<SummaryComponent />', () => {
  
//   it('Renders a form for searching', () => {
//     const wrapper = shallow(<SummaryComponent />);
//     expect(wrapper.find('.formInput')).to.have.lengthOf(1)
//   })

//   it('Renders savedWeather component', () => {
//     const wrapper = shallow(<SummaryComponent />);
//     expect(wrapper.find('#savedWeather')).to.have.lengthOf(1)
//   })
// })

