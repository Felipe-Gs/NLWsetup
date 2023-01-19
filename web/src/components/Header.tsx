import LogoImage from '../assets/logo.svg';
import {Plus} from 'phosphor-react'


export function Header(){
    return(
        <div className='w-full max-w-3xl mx-auto flex items-center justify-between'>
          <img src={LogoImage} alt="habits" />
          <button 
            type='button'
            className='border border-violet-500 font-semibold rounded-lg px-6 py-4 flex item-center gap-3 hover:border-violet-300'
            >
            <Plus size={20} className="text-violet-500"/>  
            Novo habito
          </button>
        </div>
    )
}