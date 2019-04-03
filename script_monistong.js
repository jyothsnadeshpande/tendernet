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

/**
 * Submit an Enginnner's validation
 * @param {org.acme.contract.Engineer_Validate} engineerValidate - valdation to be submitted
 * @transaction
 */
async function engineerValidate(engineerValidate){
    const contract = engineerValidate.engineerValidationData.contract;
  if(!engineerValidate.engineerValidationData.validation){
    engineerValidate.engineerValidationData.validation = []
  }
  
  if(contract.document.length == engineerValidate.engineerValidationData.validation.length){
    for(var i = 0; i<contract.document.length;i++){
      if(engineerValidate.engineerValidationData.validation[i] !== contract.document.length[i]){
        throw new Error("RECHECK VALIDATION ARRAY");
      }
    }
        engineerValidate.contract.engineerValidationStatus = "Validated";
  }
  
  else
  {
    
    for(var i = 0; i<contract.document.length;i++){
        if(engineerValidate.engineerValidationData.validation[i] !== contract.document.length[i]){
          engineerValidate.engineerValidationData.notValidated.push(contract.document.length[i]);
          
        }
    }
        engineerValidate.engineerValidationData.contract.engineerValidationStatus = " Not Validated";
  }
  
    const contractValidationRegistry = await getAssetRegistry('org.acme.contract.Contract');
    await contractValidationRegistry.update(contract);
}


/**
 * Submit a LabourRep's validation
 * @param {org.acme.contract.LabourRep_Validate} labourRepValidate - valdation to be submitted
 * @transaction
 */
async function labourRepValidate(labourRepValidate){
    const contract =labourRepValidate.labourRepValidationData.contract;
  if(!labourRepValidate.labourRepValidationData.validation){
    labourRepValidate.labourRepValidationData.validation = []
  }
  
  if(contract.document.length == labourRep.labourRepValidationData.validation.length){
    for(var i = 0; i<contract.document.length;i++){
      if(labourRepValidate.labourRepValidationData.validation[i] !== contract.document.length[i]){
        throw new Error("RECHECK VALIDATION ARRAY");
      }
    }
        labourRepValidate.contract.labourRepValidationStatus = "Validated";
  }
  
  else
  {
    
    for(var i = 0; i<contract.document.length;i++){
        if(labourRepValidate.labourRepValidationData.validation[i] !== contract.document.length[i]){
          labourRepValidate.labourRepValidationData.notValidated.push(contract.document.length[i]);
          
        }
    }
        labourRepValidate.labourRepValidationData.contract.labourRepValidationStatus = " Not Validated";
  }
  
    const contractValidationRegistry = await getAssetRegistry('org.acme.contract.Contract');
    await contractValidationRegistry.update(contract);
}


/**
 * Submit a Supplier's validation
 * @param {org.acme.contract.Supplier_Validate} SupplierValidate - valdation to be submitted
 * @transaction
 */
async function suppplierValidate(supplierValidate){
    const contract =suppplierValidate.suppplierValidationData.contract;
  if(!suppplierValidate.suppplierValidationData.validation){
    suppplierValidate.suppplierValidationData.validation = []
  }
  
  if(contract.document.length == suppplier.suppplierValidationData.validation.length){
    for(var i = 0; i<contract.document.length;i++){
      if(suppplierValidate.suppplierValidationData.validation[i] !== contract.document.length[i]){
        throw new Error("RECHECK VALIDATION ARRAY");
      }
    }
        suppplierValidate.contract.suppplierValidationStatus = "Validated";
  }
  
  else
  {
    
    for(var i = 0; i<contract.document.length;i++){
        if(suppplierValidate.suppplierValidationData.validation[i] !== contract.document.length[i]){
          suppplierValidate.suppplierValidationData.notValidated.push(contract.document.length[i]);
          
        }
    }
        suppplierValidate.suppplierValidationData.contract.suppplierValidationStatus = " Not Validated";
  }
  
    const contractValidationRegistry = await getAssetRegistry('org.acme.contract.Contract');
    await contractValidationRegistry.update(contract);
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
