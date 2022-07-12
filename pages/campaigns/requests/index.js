import React, {Component} from "react";
import Layout from "../../../Components/Layout";
import {Button, Table,Grid} from "semantic-ui-react";
import {Link} from "../../../routes";
import Campaign from "../../../Ethereum/campaign";
import RequestRow from "../../../Components/RequestRow";
class RequestIndex extends Component{
    
    static async getInitialProps(props){
        const {address} = props.query;
        const campaign = Campaign(address);
        const requestCount=await campaign.methods.getRequestsCount().call();
        const approversCount = await campaign.methods.approversCount().call();
        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((element,index)=>{
                return campaign.methods.requests(index).call()
            })
        );
        
        return {address,requests,requestCount, approversCount};
    }

    renderRow(){
        return this.props.requests.map((request,index)=>{
            return (
            <RequestRow
                key={index}
                id={index}
                approversCount={this.props.approversCount}
                request={request}
                address={this.props.address}
            />
            );
        });
    }

    render(){
        const {Header, HeaderCell, Row, Body} = Table;
        return(
            <Layout>
                <Grid>
                    <Grid.Column width={13}>
                        <h3> Requests List</h3>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Link route={`/campaigns/${this.props.address}/requests/new`}>
                            <a>
                                <Button primary> Add Request</Button>
                            </a>
                        </Link>
                    </Grid.Column>
                </Grid>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount (ether)</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRow() }
                    </Body>
                </Table>
                <div>Found {this.props.requestCount} requests</div>
            </Layout>
        );
    }
}
export default RequestIndex;