import React,{Component} from "react";
import { Button, Card, Grid } from "semantic-ui-react";
import Layout from "../../Components/Layout";
import Campaign from "../../ethereum/campaign";
import web3 from "../../Ethereum/web3";
import ContributeForm from "../../Components/ContributeForm";
import {Link} from "../../routes";
class CampaignShow extends Component {
    static async getInitialProps(props){
        const campaign=Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        
        return {
            address:props.query.address,
            minimumContribution: summary[0],
            balance:summary[1],
            requestsCount:summary[2],
            approversCount:summary[3],
            manager:summary[4]
        };
    }
    
    renderCards(){
        const{
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount
        } = this.props;

        const items = [
            {
                header: manager,
                meta:'Address of Manager',
                description:'The manager created this campaign and can create requests to withdraw money',
                style:{overflowWrap:'break-word'} //overflowwrap is used to wrap address to second line within card
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description:'This is the minimum contribution required for becoming an approver'
            },
            {
                header: requestsCount,
                meta: 'Number of requests',
                description: ' A request tries to withdraw money from the campaign for a particular task, this needs to be approved by contributors for successful withdrawal',
                style:{overflowWrap:'break-word'}
            },
            {
                header: approversCount,
                meta:"Number of Approvers",
                description:'Number of people who have already contributed to this campaign'
            },
            {
                header:web3.utils.fromWei(balance,'ether'),
                meta:'Current Campaign Balance(ether)',
                description:'Displays the current balance of the campaign in ether. This is the amount that the campaign has left to spend'
            }
        ];

        return <Card.Group items={items}/>;
    }

    render(){
        return (
            <Layout>
                <h3> Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                            
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary> View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}
export default CampaignShow;