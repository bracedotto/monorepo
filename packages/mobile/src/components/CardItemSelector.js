import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg'

import { MAX_SELECTED_LINK_IDS } from '../types/const';
import {
  addSelectedLinkIds, deleteSelectedLinkIds,
} from '../actions';
import { makeIsLinkIdSelected, getSelectedLinkIdsLength } from '../selectors';
import { tailwind } from '../stylesheets/tailwind';
import { popupOpenAnimConfig, popupCloseAnimConfig } from '../types/animConfigs';

class CardItemSelector extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      didCloseAnimEnd: !props.isBulkEditing,
      isMaxErrorShown: false,
      didMaxErrorCloseAnimEnd: true,
    };

    this.circleScale = new Animated.Value(0);
    this.maxErrorScale = new Animated.Value(0);
  }

  componentDidMount() {
    if (this.props.isBulkEditing) {
      Animated.spring(
        this.circleScale, { toValue: 1, ...popupOpenAnimConfig }
      ).start();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isBulkEditing } = this.props;
    const { isMaxErrorShown } = this.state;

    if (!prevProps.isBulkEditing && isBulkEditing) {
      Animated.spring(
        this.circleScale, { toValue: 1, ...popupOpenAnimConfig }
      ).start();
    }

    if (prevProps.isBulkEditing && !isBulkEditing) {
      Animated.spring(
        this.circleScale, { toValue: 0, ...popupCloseAnimConfig }
      ).start(() => {
        this.setState({ didCloseAnimEnd: true });
      });
    }

    if (!prevState.isMaxErrorShown && isMaxErrorShown) {
      Animated.spring(
        this.maxErrorScale, { toValue: 1, ...popupOpenAnimConfig }
      ).start();
    }

    if (prevState.isMaxErrorShown && !isMaxErrorShown) {
      Animated.spring(
        this.maxErrorScale, { toValue: 0, ...popupCloseAnimConfig }
      ).start(() => {
        this.setState({ didMaxErrorCloseAnimEnd: true });
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {

    if (!this.props.isBulkEditing && nextProps.isBulkEditing) {
      if (this.state.didCloseAnimEnd) {
        this.setState({ didCloseAnimEnd: false });
      }
    }

    if (
      this.state.isMaxErrorShown === true &&
      nextProps.selectedLinkIdsLength < MAX_SELECTED_LINK_IDS
    ) {
      this.setState({ isMaxErrorShown: false });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.isBulkEditing !== nextProps.isBulkEditing ||
      this.props.isSelected !== nextProps.isSelected ||
      this.state.didCloseAnimEnd !== nextState.didCloseAnimEnd ||
      this.state.isMaxErrorShown !== nextState.isMaxErrorShown ||
      this.state.didMaxErrorCloseAnimEnd !== nextState.didMaxErrorCloseAnimEnd
    ) {
      return true;
    }

    return false;
  }

  onSelectBtnClick = () => {

    const { linkId, isSelected, selectedLinkIdsLength } = this.props;

    if (!isSelected && selectedLinkIdsLength === MAX_SELECTED_LINK_IDS) {
      this.setState({ isMaxErrorShown: true, didMaxErrorCloseAnimEnd: false });
      return;
    }
    this.setState({ isMaxErrorShown: false });

    if (isSelected) this.props.deleteSelectedLinkIds([linkId]);
    else this.props.addSelectedLinkIds([linkId]);
  }

  renderMaxError() {

    if (!this.state.isMaxErrorShown && this.state.didMaxErrorCloseAnimEnd) return null;

    const maxErrorStyle = { transform: [{ scale: this.maxErrorScale }] };

    return (
      <View style={tailwind('absolute top-0 inset-x-0 justify-center items-center')}>
        <Animated.View style={[tailwind('m-4 p-4 bg-red-100 rounded-md'), maxErrorStyle]}>
          <View style={tailwind('flex-row w-full')}>
            <View style={tailwind('flex-shrink-0 flex-grow-0')}>
              <Svg style={tailwind('text-base text-red-600 font-normal')} width={24} height={24} viewBox="0 0 20 20" fill="currentColor">
                <Path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </Svg>
            </View>
            <View style={tailwind('ml-3 flex-shrink flex-grow')}>
              <Text style={tailwind('text-sm text-red-800 font-medium leading-5 text-left')}>To prevent network overload, up to {MAX_SELECTED_LINK_IDS} items can be selected.</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }

  render() {

    if (!this.props.isBulkEditing && this.state.didCloseAnimEnd) return null;

    const { isSelected } = this.props;

    const circleStyleClasses = isSelected ? 'bg-gray-900' : 'bg-gray-100 opacity-90';
    const svgStyleClasses = isSelected ? 'text-white' : 'text-gray-500';

    const circleStyle = { transform: [{ scale: this.circleScale }] };

    return (
      <React.Fragment>
        <View style={tailwind('absolute inset-0 bg-gray-900 opacity-25 rounded-lg elevation-xs')}></View>
        <TouchableOpacity onPress={this.onSelectBtnClick} style={tailwind('absolute inset-0 justify-center items-center bg-transparent')}>
          <Animated.View style={[tailwind(`justify-center items-center w-32 h-32 rounded-full ${circleStyleClasses}`), circleStyle]}>
            <Svg style={tailwind(`text-base ${svgStyleClasses} font-normal`)} width={80} height={80} viewBox="0 0 20 20" fill="currentColor">
              <Path fillRule="evenodd" clipRule="evenodd" d="M16.7071 5.29289C17.0976 5.68342 17.0976 6.31658 16.7071 6.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L8 12.5858L15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289Z" />
            </Svg>
          </Animated.View>
          {this.renderMaxError()}
        </TouchableOpacity>
      </React.Fragment>
    );
  }
}

CardItemSelector.propTypes = {
  linkId: PropTypes.string.isRequired,
};

const makeMapStateToProps = () => {

  const isLinkIdSelected = makeIsLinkIdSelected();

  const mapStateToProps = (state, props) => {
    return {
      isBulkEditing: state.display.isBulkEditing,
      isSelected: isLinkIdSelected(state, props),
      selectedLinkIdsLength: getSelectedLinkIdsLength(state),
    }
  }

  return mapStateToProps
};

const mapDispatchToProps = { addSelectedLinkIds, deleteSelectedLinkIds };

export default connect(makeMapStateToProps, mapDispatchToProps)(CardItemSelector);
