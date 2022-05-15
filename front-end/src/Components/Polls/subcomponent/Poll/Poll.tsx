import { useState } from 'react';

import './Poll.scss'

import { PollProp, VoteType } from '../../../../Types/Types';

import { useAppDispatch, useAppSelector } from '../../../../Redux/Hooks/hooks';
import { fetchPutPolls } from '../../../../Redux/Slice/voteSlice';
import { fetchGetPolls } from '../../../../Redux/Slice/getPollSlice';
import { deletePoll } from '../../../../Redux/Slice/deletingPollSlice';
import EditPoll from '../EditPoll/EditPoll';

const Poll = ({ id, name, question, options }: PollProp) => {

    const dispatch = useAppDispatch()
    const { infoLogin } = useAppSelector(state => state.usersLogin)
    const { infoGetPolls } = useAppSelector(state => state.getPolls)

    const [isOpenEdit, setIsShownEdit] = useState<boolean>(false)

    let optionJsonParse: object = JSON.parse(options)
    const optionJsonParseValuses = Object.values(optionJsonParse)

    const handleRefresh = () => {
        dispatch<any>(fetchGetPolls(infoLogin.rows[0].user_id));
    }

    const handlePollDelete = (e: React.MouseEvent<HTMLButtonElement>) => {

        const delData = { creatorId: String(infoLogin.rows[0].user_id), id: id }
        console.log(id)
        dispatch<any>(deletePoll(delData))
    }

    const handleBtnFunction = (event: any, vote?: any, index?: number) => {
        event.preventDefault();

        const putOption = { id: Number(id), optionId: vote.id }

        dispatch<any>(fetchPutPolls(putOption));
        handleRefresh()
    }

    const handleEdit = (event: any) => {
        event.preventDefault();
        setIsShownEdit(!isOpenEdit)
    }

    const buttonOfChoose = () => optionJsonParseValuses.map((valueOfJsonData: any, index: number) => !Boolean(typeof (valueOfJsonData.name) === String(undefined)) && <button key={valueOfJsonData.id} className='addedBtn' onClick={(event: any) => handleBtnFunction(event, valueOfJsonData, index)}>{valueOfJsonData.name}--{valueOfJsonData.vote}</button>);

    const circleStyle = () => {

        let percentArr: number[] = []
        let colorArr: string[] = []
        let voteSum: number = 0

        optionJsonParseValuses.forEach(({ vote }: VoteType) => {
            voteSum += vote
        })

        optionJsonParseValuses.forEach(({ vote, color }: VoteType) => {
            percentArr.push(Number(((vote / voteSum) * 100).toFixed(2)))
            colorArr.push(String(color))
        })

        let sectionOfStyle = ``
        let percent0 = 0;

        if (voteSum === 0) {
            const fin = Number((100 / Number(percentArr.length)).toFixed(2))
            percentArr.forEach((el, i) => (percentArr[i] = fin))
        }

        percentArr.forEach((el: number, i: number) => {
            let percent1 = Number((percent0 + el).toFixed(2));
            sectionOfStyle += `${colorArr[i]} ${percent0}% ${percent1}%, `
            percent0 = percent1
        })

        let style = `conic-gradient(${sectionOfStyle})`
        style = style.replace(", )", ")")
        return style
    }

    const test = () => infoGetPolls.data.map((el) => EditPoll(id, handleEdit, el.id, el))
    return (
        <section className='pollSection'>
            <button onClick={handlePollDelete}>del</button>
            <button onClick={handleEdit}>Edit</button>
            {EditPoll(isOpenEdit, handleEdit, id)}
            {/* {test} */}
            <h2>{name}</h2>
            <h3>{question}</h3>
            <div className='firstPart' style={({ background: circleStyle() })}></div>
            <div className='secondPart'>
                {buttonOfChoose()}
            </div>
            <p>{id}</p>
        </section>
    )
}

export default Poll