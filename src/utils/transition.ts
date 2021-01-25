import { ITransition } from "../../index.d";

const Slide = {
    match: {
        transform: 'translateX(0)'
    },
    trans: {
        transition: 'all 500ms ease'
    },
    delay: 500
};

export const Fade = {
    ...Slide,
    match: {
        ...Slide.match,
        opacity: 1,
    },
    notMatch: {
        opacity: 0,
    }
};

export const LeftFade: ITransition = {
    ...Fade,
    notMatch: {
        ...Fade.notMatch,
        transform: 'translateX(-30vw)'
    }
};

export const RightFade: ITransition = {
    ...Fade,
    notMatch: {
        ...Fade.notMatch,
        transform: 'translateX(30vw)'
    }
};

export const TopFade: ITransition = {
    ...Fade,
    notMatch: {
        ...Fade.notMatch,
        transform: 'translateY(-30vh)'
    }
};

export const BottomFade: ITransition = {
    ...Fade,
    notMatch: {
        ...Fade.notMatch,
        transform: 'translateY(30vh)'
    }
};

export const LeftSlide: ITransition = {
    ...Slide,
    notMatch: {
        transform: 'translateX(-100vw)'
    }
};

export const RightSlide: ITransition = {
    ...Slide,
    notMatch: {
        transform: 'translateX(100vw)'
    }
};

export const TopSlide: ITransition = {
    ...Slide,
    notMatch: {
        transform: 'translateY(-100vh)'
    }
};

export const BottomSlide: ITransition = {
    ...Slide,
    notMatch: {
        transform: 'translateY(100vh)'
    }
};
