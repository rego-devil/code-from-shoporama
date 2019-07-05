import React from 'react';
import _ from 'lodash';
import styles from './DublicateModalContent.scss';
import { Field } from 'redux-form';
import {DUBLICATE_PROPERTIES} from '../../dublicate-properties';
import ToggleSwitchEmpty from 'components/ToggleSwitchEmpty';
import {required} from 'utils/validators';

const ToogleAction = ({input, children}) => (
  <ToggleSwitchEmpty order={true} input={input}>{children}</ToggleSwitchEmpty>
)

const DublicateModalContent = ({onChangeFieldsForDublication}) => {

    let resultArray = []; 
    let res = [];

    // modify array of properties
    DUBLICATE_PROPERTIES.forEach((item, i, arr) => {
      res = [...res, item]
      if(i % 2 != 0 || i == arr.length - 1) {
        resultArray.push(res);
        res = []
      }    
    });

    return (
      <React.Fragment>
        <div className={styles.commonTitle}>Seliziona i campi che vuoi dublicare. Potrai modificarli successivamente.</div>
        <div className={styles.wrapper}>
        {
          resultArray.map((item, i) => (
            <div key={item[0].id} className={`${i % 2 ? styles.odd : ''} ${styles.item}`}>
              {
                item.map((column, j) => (
                  <div key={column.id} className={styles.column}>
                    <Field
                      name={`toogle_${column.id}`}
                      component={ToogleAction}
                      validate={required}
                      onChange={(event, newValue, previousValue, name) => onChangeFieldsForDublication({newValue, name, id: column.id})}
                    >
                      {column.title}
                    </Field>
                    <div className={styles.description}>{column.description}</div>
                  </div>
                ))
              }
            </div>
          ))
        }
        </div>
      </React.Fragment>
    ) 
}


export default DublicateModalContent