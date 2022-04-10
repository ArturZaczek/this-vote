import { useEffect, useState } from 'react';
import type { ChangeEvent, MouseEvent } from "react"
import Modal from '../Modal/Modal';

import './Pools.scss'

import Pool from './subcomponent/Pool/Pool';

import { useAppDispatch, useAppSelector } from '../../Redux/Hooks/hooks';
import { fetchPostPolls } from '../../Redux/Slice/postPollsSlice';
import { pollsData } from '../../Redux/ReduxTypes/reduxTypes';
import { ObjectPushType, optionListType } from '../../Types/Types';
import { fetchGetPolls } from '../../Redux/Slice/getPoolSlice';

let optionsList: optionListType[] = []

const Pools = () => {
    const dispatch = useAppDispatch();

    const { infoLogin } = useAppSelector(state => state.users)
    const { statusGetPolls, infoGetPolls } = useAppSelector(state => state.getPolls)

    const [isShown, setIsShown] = useState<boolean>(false)
    const [optionText, setOptionText] = useState<string>("");
    const [nameText, setNameText] = useState<string>("");
    const [questionText, setQuestionText] = useState<string>("");
    const [optionColor, setOptionColor] = useState<string>("#000000");
    const [randomNumber, setRandomNumber] = useState<number>(0);

    const handleRandomNumber = (event?: MouseEvent<HTMLButtonElement>) => {
        event?.preventDefault()
        setRandomNumber((Math.floor(Math.random() * 100000) + 100000))
    }

    const handleModal = (event: MouseEvent<HTMLButtonElement>) => {
        setIsShown(!isShown)
        handleRandomNumber(event)
    }

    const handleNameText = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setNameText(e.target.value)
    }
    const handleQuestionText = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setQuestionText(e.target.value)
    }

    const handleClearInput = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setOptionText("")
        setNameText("")
        setQuestionText("")
        handleRandomNumber()
        optionsList = []
    }

    const handleOptionText = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setOptionText((event.target.value))
    }

    const handleOptionColor = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setOptionColor(event.target.value)
    }

    const handleAddOption = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (!Boolean(optionText === "") && optionsList.length < 6) {
            optionsList = [...optionsList, { name: optionText.trim(), color: optionColor }]
            setOptionText("")
        }
    }

    let text: ObjectPushType = {};
    optionsList.forEach((option, index) => text[`option${index}`] = option)

    const poolsObject: pollsData = {
        name: nameText,
        question: questionText,
        number: randomNumber,
        option: text,
        id: infoLogin.rows[0].user_id
    }

    const handleSendPool = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (Boolean(questionText) && Boolean(nameText) && Boolean(optionsList.length !== 0)) {
            dispatch<any>(fetchPostPolls(poolsObject));
            handleClearInput(event);
        }
    }

    const handleGetPoll = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        dispatch<any>(fetchGetPolls(infoLogin.rows[0].user_id))
    }

    useEffect(() => { dispatch<any>(fetchGetPolls(infoLogin.rows[0].user_id)) }, [dispatch, infoLogin.rows])

    const optionShow = () => optionsList.map((option: any, index: number) => <p className='optionShow' key={index}>{option?.name} <span className='optionDotColor' style={({ borderColor: `${option.color}`, backgroundColor: `${option.color}` })}></span></p>)

    const idJ = () => infoGetPolls.data.map((el: any, index: number) => <Pool key={index} index={index} id={el.id} name={el.name} question={el.question} options={el.options} />);

    return (
        <section className='mainPollsSection'>
            <button className='addPoll' onClick={handleModal}>Add pool</button>
            <Modal isOpen={isShown} >
                <div className='modalPoll'>
                    <form className='modalFormPoll'>
                        <label>Name:</label>
                        <input type="text" onChange={handleNameText} value={nameText} />
                        <label>Question:</label>
                        <input type="text" onChange={handleQuestionText} value={questionText} />
                        <label className='numberLabel'>Number:</label>
                        <input className='numberInput' type="number" readOnly disabled value={randomNumber} />
                        <label>Option to choose in pool (max 6):</label>
                        <input type="text" value={optionText} onChange={handleOptionText} />
                        <input type="color" onChange={handleOptionColor} value={optionColor} />
                        <button onClick={handleAddOption}>+</button>
                        {optionShow()}
                    </form>
                    <div>
                        <button className='btnModalClose' onClick={handleModal}>Close</button>
                        <button className='btnModalClose' onClick={handleSendPool}>Submmit</button>
                    </div>
                </div>
            </Modal>
            <button className='addPoll' onClick={handleGetPoll}>test pobierania polls</button>

            {idJ()}
        </section>
    )
}

export default Pools