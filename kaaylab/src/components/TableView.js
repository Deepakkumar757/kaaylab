import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit'
import { FaGreaterThan, FaLessThan } from 'react-icons/fa'
import '../App.css'
const TableView = () => {
   const [apiData, setapiData] = useState([])
   const [apiMainData, setapiMainData] = useState([])
   const [tableHead, settableHead] = useState([])
   const apiUrl = process.env.REACT_APP_MY_API
   const [searchValue, setsearchValue] = useState('')
   const [pageNum, setpageNum] = useState(1)
   const [nextBtnDisabled, setnextBtnDisabled] = useState(false)
const perPage=10
   useEffect(() => {
      dataFetch()
   }, [])

   const dataFetch = async () => {
      ////get data from API
      const data = await axios.get(apiUrl)
      const data1 = data.data
      let tempVar = []
      let i = 0
      ////filter first 10 fields
      Object.entries(data1[0]).forEach(([key]) => {
         if (i < 10) {
            tempVar.push(key)
            i = i + 1
         }
      })
      ////// Data stored to state variable
      settableHead(tempVar)
      //   setapiData(data1)
      setapiMainData(data1)
      paginationFunc(data1, pageNum)
   }
   const paginationFunc = (data, pageNum) => {
      let tempData = data
      let newList = []
      

      newList = tempData.slice((pageNum - 1) * perPage, pageNum * perPage)
      if (data.length <= pageNum * perPage) {
         setnextBtnDisabled(true)
      } else {
         setnextBtnDisabled(false)
      }
      setapiData(newList)
   }
   const searchResultFetch = (e) => {
      ////search Box filterFunction

      const val = e.target.value
      setsearchValue(val)

      //// copy the overall data
      let list1 = JSON.parse(JSON.stringify(apiMainData))
      let filterdVal = []
      // filter the data by the given input
      list1.forEach((e) => {
         let name = e.name.toUpperCase()
         if (name.includes(val.toUpperCase())) {
            filterdVal.push(e)
         }
      })
      paginationFunc(filterdVal, pageNum)
   }
   const onClickPrevios = () => {
      let tempNum = pageNum
      if (tempNum !== 1) {
         tempNum = tempNum - 1
      }
      paginationFunc(apiMainData, tempNum)
      setpageNum(tempNum)
   }
   const onClickNext = () => {
      let tempNum = pageNum
      if (!(apiMainData.length <= pageNum * perPage)) {
         tempNum = tempNum + 1
      }
      paginationFunc(apiMainData, tempNum)
      setpageNum(tempNum)
   }
   return (
      <div>
         <div
            style={{
               width: '100%',
               height: '100px',
               //    display: 'flex',
            }}>
            <div className='form-group' style={{ marginLeft: '80%' }}>
               <label htmlFor='formGroupExampleInput'>Search</label>
               <input
                  type='text'
                  className='form-control'
                  id='formGroupExampleInput'
                  value={searchValue}
                  onChange={(e) => {
                     searchResultFetch(e)
                  }}
               />
            </div>
         </div>
         <MDBTable bordered responsive>
            <MDBTableHead>
               <tr style={{ textAlign: 'center' }}>
                  {tableHead.map((e, i) => (
                     <th key={i} scope='col'>
                        {e}
                     </th>
                  ))}
               </tr>
            </MDBTableHead>
            <MDBTableBody>
               {apiData.length !== 0 ? (
                  apiData.map((e, i) => {
                     return (
                        <tr key={i}>
                           {tableHead.map((e1, i1) => {
                              if (e1 !== 'image_url') {
                                 return (
                                    <td
                                       style={{ maxWidth: '200px' }}
                                       key={i1}
                                       scope='row'>
                                       {e[e1]}
                                    </td>
                                 )
                              } else {
                                 return (
                                    <td
                                       style={{ textAlign: 'center' }}
                                       key={i1}>
                                       <img
                                          alt='#'
                                          width='70'
                                          height='160'
                                          src={e[e1]}
                                       />
                                    </td>
                                 )
                              }
                           })}
                        </tr>
                     )
                  })
               ) : (
                  <td
                     colSpan={10}
                     style={{
                        textAlign: 'center',
                        fontSize: '30px',
                     }}>
                     {' '}
                     NO DATA FOUND
                  </td>
               )}
            </MDBTableBody>
         </MDBTable>
         <div className='pagination'>
            <label className='label label-primary'>page :{pageNum}</label>&emsp;
            <button
               className='btn btn-primary'
               onClick={() => {
                  onClickPrevios()
               }}>
               Previous
            </button>
            &emsp;
            <button
               disabled={nextBtnDisabled}
               className='btn btn-primary'
               onClick={() => {
                  onClickNext()
               }}>
               Next
            </button>
         </div>
      </div>
   )
}

export default TableView
