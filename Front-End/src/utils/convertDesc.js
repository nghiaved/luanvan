const convertDesc = desc => {
    desc = desc.replace(/<[^>]*>/g, " ")
    if (desc.length < 50) return desc
    desc = desc.substring(0, 50).concat(" ...")
    return desc
}

export default convertDesc