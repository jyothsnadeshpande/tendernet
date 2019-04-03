/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getFactory emit */
/**
 * Submit validations
 * @param {org.acme.contract.Engineer_Validate} engineerValidate - document validation
 * @transaction
 */
async function Engineervalidate(engineerValidate){
	const contract = engineerValidate.contract;
     
    for(var i = 0; i < contract.document.length; i++){
    	
    }
    
      
    
  	
  	
}
/**
 * Submit a document
 * @param {org.acme.contract.SubmitDocument} submitDocument - document to be submitted
 * @transaction
 */
async function submitDocument(submitDocument){
	const document = submitDocument.document;
  	if(document.contract.state !== 'OPEN'){
    	throw new Error('Contract is closed');
    }
  	if (!document.contract.documents) {
        document.contract.documents = [];
    }  	
  	document.contract.documents.push(submitDocument);
  	const documentRegistry = await getAssetRegistry(org.acme.contract.Contract);
  	await documentRegistry.update(document);
    
}
/**
 * Close the contract once the project is over
 * @param {org.acme.contract.CloseContract} closeContract - the contract
 * @transaction
 */
async function closeContract(closeContract){
	const contract = closeContract.contract;
    if(contract.state !== 'OPEN'){
		throw new Error('Closed Already');
    }
  	closeContract.expenditure = 0;
  	for(var i = 0; i < contract.document.length; i++){
    	closeContract.expenditure += contract.document[i].amount;
    }
  	closeContract.contract.value = closeContract.expenditure;
  	contract.state = 'CLOSED';
  	
  	const contractAssetRegistry = await getAssetRegistry('org.acme.contract.Contract');
  	await contractAssetRegistry.update(contract);
}
