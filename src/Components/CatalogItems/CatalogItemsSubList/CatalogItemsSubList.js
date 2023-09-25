import React from "react";
// import styles from "./CatalogItemsSubList.module.css";
import CatalogItemsList from "../CatalogItemsList/CatalogItemsList";

const CatalogItemsSubList = (props) => {
  return (
    <CatalogItemsList
      catalogItemsObj={props.catalogItemsObj}
      key={props.key}
      parentKey={props.parentKey}
      parentsParentKey={props.parentsParentKey}
      parentMasterID={props.parentMasterID}
      displayConditions={props.displayConditions}
      subListLevel={props.subListLevel ? props.subListLevel + 1 : 1}
      unlockProtectedVisible={props.unlockProtectedVisible}
      showProtectedHidden={props.showProtectedHidden}
      refresh={props.refresh}
      onlyList={props.onlyList}
      emptyForm={props.emptyForm}
    />
  );
};

export default CatalogItemsSubList;
