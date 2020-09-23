import React, { Component } from 'react';
import styled from 'styled-components';
import { textChangeRangeIsUnchanged } from 'typescript';
import close from '../../../assets/close.png';

import { Context } from '../../../Context';
import YamlEditor from '../../../lib/YamlEditor';

type ClusterOption = {
  name: string,
  selected: boolean,
}

const dummyClusters: ClusterOption[]  = [
  { name: 'happy-lil-trees', selected: true },
  { name: 'joyous-petite-rocks', selected: false },
  { name: 'friendly-small-bush', selected: false }
];

type PropsType = {
};

type StateType = {
  currentTab: string,
  clusters: ClusterOption[]
};

export default class ClusterConfigModal extends Component<PropsType, StateType> {
  state = {
    currentTab: 'kubeconfig',
    clusters: new Array<ClusterOption>(),
  }

  componentDidMount() {
    this.setState({ clusters: dummyClusters });
  }

  renderLine = (tab: string) => {
    if (this.state.currentTab == tab) {
      return <Highlight />
    }
  }

  toggleCluster = (i: number) => {
    let newClusters = this.state.clusters;
    newClusters[i].selected = !this.state.clusters[i].selected;
    this.setState({ clusters: newClusters });
  }

  renderClusterList = () => {
    if (this.state.clusters.length > 0) {
      return this.state.clusters.map((cluster: ClusterOption, i) => {
        return (
          <Row key={i} onClick={() => this.toggleCluster(i)}>
            <Checkbox checked={cluster.selected}>
              <i className="material-icons">done</i>
            </Checkbox>
            {cluster.name}
          </Row>
        );
      })
    }

    return (
      <Placeholder>
        You need to 
        <LinkText onClick={() => this.setState({ currentTab: 'kubeconfig'})}>
          supply a kubeconfig
        </LinkText>
        first
      </Placeholder>
    );
  }
  
  renderTabContents = () => {
    if (this.state.currentTab === 'kubeconfig') {
      return (
        <div>
          <Subtitle>Copy and paste your kubeconfig below</Subtitle>
          <YamlEditor />
          <Button>Save Kubeconfig</Button>
        </div>
      )
    }

    return (
      <div>
        <Subtitle>Select the clusters you want Porter to connect to</Subtitle>
        <ClusterList>
          {this.renderClusterList()}
        </ClusterList>
        <Button disabled={true}>Save Selected</Button>
      </div>
    )
  }

  render() {
    return (
      <StyledClusterConfigModal>
        <CloseButton onClick={() => { this.context.setCurrentModal(null) }}>
          <CloseButtonImg src={close} />
        </CloseButton>

        <Header>
          <Plus>+</Plus>
          Manage Clusters
        </Header>
        <ModalTitle>Connect from Kubeconfig</ModalTitle>
        <TabSelector>
          <Tab onClick={() => this.setState({ currentTab: 'kubeconfig' })}>
            Raw Kubeconfig
            {this.renderLine('kubeconfig')}
          </Tab>
          <Tab onClick={() => this.setState({ currentTab: 'select' })}>
            Select Clusters
            {this.renderLine('select')}
          </Tab>
        </TabSelector>
        {this.renderTabContents()}
      </StyledClusterConfigModal>
    );
  }
}

ClusterConfigModal.contextType = Context;

const Checkbox = styled.div`
  width: 15px;
  height: 15px;
  border: 1px solid #ffffff44;
  margin: 0px 15px 0px 12px;
  border-radius: 3px;
  background: ${(props: { checked: boolean }) => props.checked ? '#ffffff22' : ''};
  display: flex;
  align-items: center;
  justify-content: center;

  > i {
    font-size: 12px;
    padding-left: 1px;
    display: ${(props: { checked: boolean }) => props.checked ? '' : 'none'};
  }
`;

const Row = styled.div`
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #ffffff22;
  display: flex;
  align-items: center;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  
  :hover {
    background: #ffffff11;
  }
`;

const LinkText = styled.span`
  font-weight: 500;
  text-decoration: underline;
  color: #949effcc;
  cursor: pointer;
  margin: 0px 5px;
`;

const Placeholder = styled.div`
  color: #ffffff44;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: -13px;
  align-items: center;
  justify-content: center;
  user-select: none;
`;

const ClusterList = styled.div`
  width: 100%;
  height: 295px;
  border-radius: 5px;
  background: #ffffff06;
  border: 1px solid #ffffff22;
`;

const Button = styled.button`
  position: absolute;
  bottom: 25px;
  right: 27px;
  height: 40px;
  font-size: 13px;
  font-weight: 500;
  font-family: 'Work Sans', sans-serif;
  color: white;
  padding: 6px 20px 7px 20px;
  text-align: left;
  border: 0;
  border-radius: 5px;
  background: ${(props) => (!props.disabled ? '#616FEEcc' : '#bbd')};
  box-shadow: ${(props) => (!props.disabled ? '0 2px 5px 0 #00000030' : 'none')};
  cursor: ${(props) => (!props.disabled ? 'pointer' : 'default')};
  user-select: none;
  :focus { outline: 0 }
  :hover {
    background: ${(props) => (!props.disabled ? '#616FEEff' : '#bbd')};
  }
`;

const Subtitle = styled.div`
  padding: 15px 0px;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  color: #aaa;
  margin-top: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Highlight = styled.div`
  width: 80%;
  height: 1px;
  margin-top: 5px;
  background: #949EFFcc;

  opacity: 0;
  animation: lineEnter 0.5s 0s;
  animation-fill-mode: forwards;
  @keyframes lineEnter {
    from { width: 0%; opacity: 0; }
    to   { width: 80%; opacity: 1; }
  }
`; 

const Tab = styled.div`
  width: 180px;
  height: 30px;
  padding: 0 10px;
  margin-right: 15px;
  display: flex;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  user-select: none;
  color: #949effcc;
  flex-direction: column;
  padding-top: 7px;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
  
  :hover {
    background: #949EFF22;
    border-radius: 5px;
  }
`;

const TabSelector = styled.div`
  display: flex;
  width: 260px;
  max-width: 100%;
  margin-left: 0px;
  justify-content: space-between;
  margin-top: 23px;
`;

const ModalTitle = styled.div`
  margin-top: 21px;
  display: flex;
  flex: 1;
  font-family: 'Assistant';
  font-size: 18px;
  color: #ffffff;
  font-weight: 700;
  align-items: center;
  position: relative;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Header = styled.div`
  display: inline-block;
  width: 100%;
  font-size: 14px;
  color: #7A838Faa;
  font-family: 'Work Sans', sans-serif;
`;

const Plus = styled.span`
  margin-right: 10px;
`;

const CloseButton = styled.div`
  position: absolute;
  display: block;
  width: 40px;
  height: 40px;
  padding: 13px 0 12px 0;
  text-align: center;
  border-radius: 50%;
  right: 15px;
  top: 12px;
  cursor: pointer;
  :hover {
    background-color: #ffffff11;
  }
`;

const CloseButtonImg = styled.img`
  width: 14px;
  margin: 0 auto;
`;

const StyledClusterConfigModal= styled.div`
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  padding: 25px 30px;
  overflow: hidden;
  border-radius: 6px;
  background: #24272a;
`;